import React, {useState, useMemo, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {AppLogo} from '../../shared/components/AppLogo';
import {useNavigation} from '../../navigation/AppNavigator';
import {useSettings} from '../../shared/services/settingsService';
import {SegmentedControl} from '../../shared/components/SegmentedControl';
import {AppIcon} from '../../shared/components/AppIcon';
import {
  StoreOrder,
  BillItem,
  StockItem,
  PaymentMode,
} from './types';

// Initial fallback stock items
const INITIAL_STOCK: StockItem[] = [
  {id: 'stk-10', riceName: 'Seeraga Samba', quantity: 500, pricePerKg: 75, brand: 'Annam'},
  {id: 'stk-11', riceName: 'Karuppu Kavuni', quantity: 300, pricePerKg: 90, brand: 'Organic Tattva'},
  {id: 'stk-12', riceName: 'keerthivasan', quantity: 400, pricePerKg: 80, brand: 'Double Horse'},
];

// Strict 2-decimal formatting
const format2Dec = (val: any): string => {
  const n = parseFloat(String(val ?? 0));
  return isNaN(n) ? '0.00' : n.toFixed(2);
};

// Formats number to Indian currency representation
const formatINR = (val: any): string => {
  const num = parseFloat(String(val ?? 0));
  const isNeg = !isNaN(num) && num < 0;
  const decStr = format2Dec(Math.abs(isNaN(num) ? 0 : num));
  const [intPart, decPart] = decStr.split('.');
  const lastThree = intPart.substring(intPart.length - 3);
  const otherNumbers = intPart.substring(0, intPart.length - 3);
  const formattedInt =
    otherNumbers !== ''
      ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
      : lastThree;
  return `${isNeg ? '-' : ''}₹${formattedInt}.${decPart}`;
};

const normalizeNum = (val: any): number => {
  const n = parseFloat(String(val ?? 0));
  return isNaN(n) ? 0 : parseFloat(n.toFixed(2));
};

// Converts number to Indian Currency Words
const numberToWordsINR = (num: number): string => {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.floor(Math.abs(num));
  if (n === 0) return 'Rupees Zero Only';

  const convertLessThanOneThousand = (val: number): string => {
    let s = '';
    if (val >= 100) {
      s += a[Math.floor(val / 100)] + ' Hundred ';
      val %= 100;
    }
    if (val > 0) {
      if (val < 20) {
        s += a[val] + ' ';
      } else {
        s += b[Math.floor(val / 10)] + ' ';
        if (val % 10 > 0) s += a[val % 10] + ' ';
      }
    }
    return s.trim();
  };

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const remainder = n % 1000;

  let res = '';
  if (crore > 0) res += convertLessThanOneThousand(crore) + ' Crore ';
  if (lakh > 0) res += convertLessThanOneThousand(lakh) + ' Lakh ';
  if (thousand > 0) res += convertLessThanOneThousand(thousand) + ' Thousand ';
  if (remainder > 0) res += convertLessThanOneThousand(remainder) + ' ';

  return `Rupees ${res.trim()} Only`;
};

const API_BASE_URL = 'http://localhost:5000/api';

export const OfflineScreen: React.FC = () => {
  const {navigate} = useNavigation();
  const {settings} = useSettings();

  const [bills, setBills] = useState<StoreOrder[]>([]);
  const [stock, setStock] = useState<StockItem[]>(INITIAL_STOCK);
  const [isWsConnected, setIsWsConnected] = useState(false);

  // Active autocomplete recommendation popover state
  const [activeDropdown, setActiveDropdown] = useState<{
    itemId: string;
    field: 'variety' | 'brand';
  } | null>(null);

  // Active cell editing
  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: 'qtyKg' | 'ratePerKg';
    text: string;
  } | null>(null);

  // Screen dimensions & density scaling
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();
  const isShortScreen = windowHeight < 880;
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  // Customer Walk-in Details
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Cash');
  const [discountStr, setDiscountStr] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const renderFormattedAddress = () => {
    const addr = settings.address || '1, 25, Naidu St, Kurinji Nagar, Ramapuram, Chennai - 600089';
    if (addr.includes('Kurinji Nagar,')) {
      const parts = addr.split('Kurinji Nagar,');
      return (
        <Text style={styles.invoiceAddressText}>
          {parts[0]}Kurinji Nagar,{'\n'}{parts[1]?.trim()}
        </Text>
      );
    }
    return <Text style={styles.invoiceAddressText}>{addr}</Text>;
  };

  // Items table
  const [lineItems, setLineItems] = useState<BillItem[]>([
    {
      id: 'item-1',
      variety: INITIAL_STOCK[0].riceName,
      brand: INITIAL_STOCK[0].brand || '',
      qtyKg: 10.0,
      ratePerKg: 75.0,
      amount: 750.0,
    },
  ]);

  const phoneInputRef = useRef<TextInput>(null);

  // Fast live stock fetcher
  const fetchLiveStock = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/stock`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStock(data);
          setIsWsConnected(true);
        }
      }
    } catch (_e) {}
  }, []);

  // Real-time live synchronization (WebSocket with auto-reconnect + 1.5s fallback poller)
  useEffect(() => {
    let ws: WebSocket | null = null;
    let isMounted = true;
    let reconnectTimeout: any = null;

    const connectWs = () => {
      if (!isMounted) return;
      try {
        ws = new WebSocket('ws://localhost:5000');
        ws.onopen = () => {
          if (isMounted) setIsWsConnected(true);
        };
        ws.onmessage = event => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'STOCK_UPDATE' && Array.isArray(data.stock) && data.stock.length > 0) {
              setStock(data.stock);
              setIsWsConnected(true);
            }
          } catch (_err) {}
        };
        ws.onerror = () => {
          if (isMounted) setIsWsConnected(false);
        };
        ws.onclose = () => {
          if (isMounted) {
            setIsWsConnected(false);
            reconnectTimeout = setTimeout(connectWs, 2000);
          }
        };
      } catch (_e) {
        if (isMounted) {
          setIsWsConnected(false);
          reconnectTimeout = setTimeout(connectWs, 2000);
        }
      }
    };

    fetchLiveStock();
    connectWs();

    const pollInterval = setInterval(() => {
      fetchLiveStock();
    }, 1500);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) {
        try {
          ws.close();
        } catch (_) {}
      }
    };
  }, [fetchLiveStock]);

  const allBrands = useMemo(() => {
    const brandSet = new Set<string>();
    stock.forEach(s => {
      if (s.brand && s.brand.trim()) {
        brandSet.add(s.brand.trim());
      }
    });
    return Array.from(brandSet);
  }, [stock]);

  const findStock = (varietyName: string): StockItem | undefined => {
    return stock.find(
      s => s.riceName.toLowerCase() === varietyName.trim().toLowerCase(),
    );
  };

  const getFilteredVarieties = (query: string): StockItem[] => {
    const q = query.trim().toLowerCase();
    if (!q) return stock;
    return stock.filter(
      s =>
        s.riceName.toLowerCase().includes(q) ||
        (s.brand && s.brand.toLowerCase().includes(q)),
    );
  };

  const getFilteredBrands = (query: string): string[] => {
    const q = query.trim().toLowerCase();
    if (!q) return allBrands;
    return allBrands.filter(b => b.toLowerCase().includes(q));
  };

  const handleUpdateLine = (id: string, field: keyof BillItem, val: any) => {
    setLineItems(prev =>
      prev.map(it => {
        if (it.id !== id) return it;
        const copy = {...it, [field]: val};

        if (field === 'variety') {
          const match = findStock(val);
          if (match) {
            copy.ratePerKg = normalizeNum(match.pricePerKg);
            copy.brand = match.brand || '';
          }
        }

        const qty = parseFloat(String(copy.qtyKg)) || 0;
        const rate = parseFloat(String(copy.ratePerKg)) || 0;
        copy.amount = normalizeNum(qty * rate);
        return copy;
      }),
    );
  };

  const handleSelectVariety = (itemId: string, stockItem: StockItem) => {
    setLineItems(prev =>
      prev.map(it => {
        if (it.id !== itemId) return it;
        const qty = normalizeNum(it.qtyKg || 10);
        const rate = normalizeNum(stockItem.pricePerKg);
        return {
          ...it,
          variety: stockItem.riceName,
          brand: stockItem.brand || '',
          qtyKg: qty,
          ratePerKg: rate,
          amount: normalizeNum(qty * rate),
        };
      }),
    );
    setActiveDropdown(null);
  };

  const handleSelectBrand = (itemId: string, selectedBrand: string) => {
    setLineItems(prev =>
      prev.map(it => {
        if (it.id !== itemId) return it;
        return {
          ...it,
          brand: selectedBrand,
        };
      }),
    );
    setActiveDropdown(null);
  };

  const handleAddStockItem = (stockItem: StockItem) => {
    const rate = normalizeNum(stockItem.pricePerKg);
    const last = lineItems[lineItems.length - 1];
    if (last && !last.variety.trim()) {
      handleUpdateLine(last.id, 'variety', stockItem.riceName);
      handleUpdateLine(last.id, 'brand', stockItem.brand || '');
      handleUpdateLine(last.id, 'ratePerKg', rate);
      return;
    }

    const newRow: BillItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      variety: stockItem.riceName,
      brand: stockItem.brand || '',
      qtyKg: 10.0,
      ratePerKg: rate,
      amount: normalizeNum(10.0 * rate),
    };
    setLineItems([...lineItems, newRow]);
  };

  const handleAddBlankRow = () => {
    const newRow: BillItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      variety: '',
      brand: '',
      qtyKg: 1.0,
      ratePerKg: 0.0,
      amount: 0.0,
    };
    setLineItems([...lineItems, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    if (lineItems.length <= 1) {
      Alert.alert('Notice', 'Bill must have at least one line item.');
      return;
    }
    setLineItems(lineItems.filter(it => it.id !== id));
  };

  const handleResetBill = () => {
    setCustomerName('Walk-in Customer');
    setCustomerPhone('');
    setDiscountStr('');
    setPaymentMode('Cash');
    const defaultRate = normalizeNum(stock[0]?.pricePerKg || 75.0);
    setLineItems([
      {
        id: `item-${Date.now()}`,
        variety: stock[0]?.riceName || 'Seeraga Samba',
        brand: stock[0]?.brand || '',
        qtyKg: 10.0,
        ratePerKg: defaultRate,
        amount: normalizeNum(10.0 * defaultRate),
      },
    ]);
  };

  // Tax calculations using dynamic settings
  const grossSubtotal = useMemo(() => {
    const sum = lineItems.reduce((acc, it) => acc + (it.amount || 0), 0);
    return normalizeNum(sum);
  }, [lineItems]);

  const totalQtyKg = useMemo(() => {
    const sum = lineItems.reduce((acc, it) => acc + (it.qtyKg || 0), 0);
    return normalizeNum(sum);
  }, [lineItems]);

  const discount = useMemo(() => {
    const d = parseFloat(discountStr) || 0;
    return normalizeNum(d);
  }, [discountStr]);

  const taxableAmount = useMemo(() => {
    return Math.max(0, normalizeNum(grossSubtotal - discount));
  }, [grossSubtotal, discount]);

  const cgstPercent = settings.enableTax ? settings.cgstPercent : 0;
  const sgstPercent = settings.enableTax ? settings.sgstPercent : 0;
  const totalGstPercent = normalizeNum(cgstPercent + sgstPercent);

  const cgstAmount = useMemo(() => {
    if (!settings.enableTax || cgstPercent <= 0) return 0;
    return normalizeNum((taxableAmount * cgstPercent) / 100);
  }, [taxableAmount, cgstPercent, settings.enableTax]);

  const sgstAmount = useMemo(() => {
    if (!settings.enableTax || sgstPercent <= 0) return 0;
    return normalizeNum((taxableAmount * sgstPercent) / 100);
  }, [taxableAmount, sgstPercent, settings.enableTax]);

  const totalTax = useMemo(() => {
    return normalizeNum(cgstAmount + sgstAmount);
  }, [cgstAmount, sgstAmount]);

  const netBeforeRound = useMemo(() => {
    return normalizeNum(taxableAmount + totalTax);
  }, [taxableAmount, totalTax]);

  const grandTotal = useMemo(() => {
    if (settings.enableRoundOff) {
      return Math.round(netBeforeRound);
    }
    return netBeforeRound;
  }, [netBeforeRound, settings.enableRoundOff]);

  const roundOff = useMemo(() => {
    return normalizeNum(grandTotal - netBeforeRound);
  }, [grandTotal, netBeforeRound]);

  const nextBillNo = `INV-${String(1001 + bills.length).padStart(4, '0')}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleSaveAndPrintBill = async () => {
    if (!customerName.trim()) {
      Alert.alert('Required', 'Please enter customer name or use "Walk-in Customer".');
      return;
    }
    if (lineItems.length === 0 || grossSubtotal <= 0) {
      Alert.alert('Required', 'Please add items with quantity and rate.');
      return;
    }

    // Deduct stock in real time
    setStock(prevStock =>
      prevStock.map(stkItem => {
        const billedForThis = lineItems.filter(
          li => li.variety.toLowerCase() === stkItem.riceName.toLowerCase(),
        );
        const totalBilledKg = billedForThis.reduce((sum, li) => sum + (li.qtyKg || 0), 0);
        return {
          ...stkItem,
          quantity: Math.max(0, stkItem.quantity - totalBilledKg),
        };
      }),
    );

    const newBill: StoreOrder = {
      id: `inv-${Date.now()}`,
      orderNo: nextBillNo,
      orderType: 'offline',
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      items: [...lineItems],
      totalQtyKg,
      subtotal: grossSubtotal,
      discount,
      taxableAmount,
      cgstPercent,
      cgstAmount,
      sgstPercent,
      sgstAmount,
      totalTax,
      roundOff,
      hsnCode: settings.hsnCode,
      grandTotal,
      paymentMode,
      paymentStatus: paymentMode === 'Due' ? 'Pending' : 'Paid',
      syncStatus: 'synced',
      createdAt: `${currentDate}, ${currentTime}`,
    };

    setIsSaving(true);
    try {
      await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newBill),
      }).catch(() => {});
    } catch (_e) {}
    setIsSaving(false);

    setBills([newBill, ...bills]);

    Alert.alert(
      'Tax Invoice Created',
      `Invoice ${newBill.orderNo} for ${formatINR(grandTotal)} saved to database.\nStock deducted: ${format2Dec(totalQtyKg)} kg.`,
    );

    handleResetBill();
  };

  return (
    <View style={styles.container}>
      <View style={styles.posSplitContainer}>
        {/* LEFT COLUMN: 60% Biller Workspace */}
        <ScrollView
          style={styles.leftPane}
          contentContainerStyle={styles.leftPaneContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* Top Quiet Status Strip */}
          <View style={styles.statusStrip}>
            <View style={styles.statusLeft}>
              <View
                style={[
                  styles.statusDot,
                  {backgroundColor: isWsConnected ? '#2E7D4F' : '#C27A12'},
                ]}
              />
              <Text style={styles.statusText}>
                {isWsConnected ? 'Connected (35.154.217.223)' : 'Connecting to DB...'}
              </Text>
              <View style={styles.taxChip}>
                <Text style={styles.taxChipText}>
                  {settings.enableTax
                    ? `GST ${totalGstPercent}% (CGST ${cgstPercent} + SGST ${sgstPercent})`
                    : 'GST 0% (Exempt)'}
                </Text>
              </View>
            </View>

            <View style={styles.statusActions}>
              <Pressable
                style={({pressed}) => [
                  styles.ghostActionBtn,
                  pressed && styles.ghostActionBtnPressed,
                ]}
                onPress={() => navigate('settings')}>
                <Text style={styles.ghostActionBtnText}>Edit Tax</Text>
              </Pressable>
              <Pressable
                style={({pressed}) => [
                  styles.ghostActionBtn,
                  pressed && styles.ghostActionBtnPressed,
                ]}
                onPress={() => fetchLiveStock()}>
                <Text style={styles.ghostActionBtnText}>Force Sync</Text>
              </Pressable>
            </View>
          </View>

          {/* Customer Details Form Row */}
          <View style={styles.card}>
            <View style={styles.customerRow}>
              <View style={[styles.fieldCol, {flex: 1.6}]}>
                <Text style={styles.fieldLabel}>
                  Customer / Buyer Name <Text style={styles.reqMarker}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Ramesh Traders or Walk-in Customer"
                  placeholderTextColor="#8B938E"
                  value={customerName}
                  onChangeText={setCustomerName}
                  returnKeyType="next"
                  onSubmitEditing={() => phoneInputRef.current?.focus()}
                />
              </View>

              <View style={[styles.fieldCol, {flex: 1.1}]}>
                <Text style={styles.fieldLabel}>Mobile Number (Optional)</Text>
                <TextInput
                  ref={phoneInputRef}
                  style={styles.textInput}
                  placeholder="10-digit mobile"
                  placeholderTextColor="#8B938E"
                  keyboardType="phone-pad"
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                />
              </View>
            </View>

            {/* Quick Add Rice Variety Tile Strip */}
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Quick Add Variety</Text>
                <Text style={styles.sectionMutedCount}>
                  {stock.length} varieties live in warehouse
                </Text>
              </View>

              <View style={styles.tilesGrid}>
                {stock.map(s => {
                  const stockQty = normalizeNum(s.quantity);
                  const barColor =
                    stockQty > 300
                      ? '#2E7D4F' // Green (>300kg)
                      : stockQty > 100
                      ? '#C27A12' // Amber (100-300kg)
                      : '#C0392B'; // Red (<100kg)

                  return (
                    <Pressable
                      key={s.id}
                      style={({pressed}) => [
                        styles.varietyTile,
                        pressed && styles.varietyTilePressed,
                      ]}
                      onPress={() => handleAddStockItem(s)}>
                      <View style={styles.tileHeader}>
                        <Text style={styles.tileTitle} numberOfLines={1}>
                          + {s.riceName}
                        </Text>
                        {s.brand ? (
                          <View style={styles.tileBrandChip}>
                            <Text style={styles.tileBrandText} numberOfLines={1}>
                              {s.brand}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <View style={styles.tileMetaRow}>
                        <Text style={styles.tileRate}>₹{format2Dec(s.pricePerKg)}/kg</Text>
                        <Text style={styles.tileStockQty}>{format2Dec(s.quantity)} kg left</Text>
                      </View>

                      {/* Thin stock-level indicator bar */}
                      <View style={styles.stockLevelBarTrack}>
                        <View
                          style={[
                            styles.stockLevelBarFill,
                            {
                              backgroundColor: barColor,
                              width: `${Math.min(100, Math.max(10, (stockQty / 500) * 100))}%`,
                            },
                          ]}
                        />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Line Items Table */}
            <View style={styles.sectionWrap}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Billed Items</Text>
                <Text style={styles.sectionMutedCount}>
                  {lineItems.length} line {lineItems.length === 1 ? 'item' : 'items'}
                </Text>
              </View>

              <View style={styles.tableCard}>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.th, {flex: 1.8}]}>RICE VARIETY</Text>
                  <Text style={[styles.th, {flex: 1.1}]}>BRAND</Text>
                  <Text style={[styles.th, {width: 85, textAlign: 'center'}]}>QTY (KG)</Text>
                  <Text style={[styles.th, {width: 95, textAlign: 'right'}]}>RATE (₹)</Text>
                  <Text style={[styles.th, {width: 75, textAlign: 'center'}]}>GST</Text>
                  <Text style={[styles.th, {width: 100, textAlign: 'right'}]}>AMOUNT (₹)</Text>
                  <Text style={[styles.th, {width: 28, textAlign: 'center'}]}></Text>
                </View>

                {lineItems.map(item => {
                  const stockMatch = findStock(item.variety);
                  const isVarietyOpen =
                    activeDropdown?.itemId === item.id && activeDropdown?.field === 'variety';
                  const isBrandOpen =
                    activeDropdown?.itemId === item.id && activeDropdown?.field === 'brand';
                  const filteredVarieties = getFilteredVarieties(item.variety || '');
                  const filteredBrands = getFilteredBrands(item.brand || '');

                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.tableRow,
                        {zIndex: isVarietyOpen || isBrandOpen ? 999 : 1},
                      ]}>
                      {/* Variety input */}
                      <View style={{flex: 1.8, paddingRight: 6}}>
                        <TextInput
                          style={styles.cellInput}
                          value={item.variety}
                          placeholder="Variety name"
                          placeholderTextColor="#8B938E"
                          onFocus={() =>
                            setActiveDropdown({itemId: item.id, field: 'variety'})
                          }
                          onChangeText={v => {
                            handleUpdateLine(item.id, 'variety', v);
                            setActiveDropdown({itemId: item.id, field: 'variety'});
                          }}
                        />
                        {stockMatch && !isVarietyOpen && (
                          <Text style={styles.inStockHelperText} numberOfLines={1}>
                            Stock: {format2Dec(stockMatch.quantity)} kg {stockMatch.brand ? `• ${stockMatch.brand}` : ''}
                          </Text>
                        )}

                        {/* Autocomplete Dropdown */}
                        {isVarietyOpen && (
                          <View style={styles.recomPopover}>
                            <View style={styles.recomHeaderBar}>
                              <Text style={styles.recomHeaderText}>Select Stock Variety</Text>
                              <Pressable onPress={() => setActiveDropdown(null)}>
                                <Text style={styles.recomCloseBtn}>✕</Text>
                              </Pressable>
                            </View>
                            <ScrollView style={{maxHeight: 160}} nestedScrollEnabled>
                              {filteredVarieties.map(stk => (
                                <Pressable
                                  key={stk.id}
                                  style={styles.recomRow}
                                  onPress={() => handleSelectVariety(item.id, stk)}>
                                  <View style={{flex: 1}}>
                                    <Text style={styles.recomRowTitle}>{stk.riceName}</Text>
                                    <Text style={styles.recomRowSub}>
                                      {stk.brand || 'Unbranded'} • {format2Dec(stk.quantity)} kg left
                                    </Text>
                                  </View>
                                  <Text style={styles.recomRowRate}>₹{format2Dec(stk.pricePerKg)}/kg</Text>
                                </Pressable>
                              ))}
                            </ScrollView>
                          </View>
                        )}
                      </View>

                      {/* Brand input */}
                      <View style={{flex: 1.1, paddingRight: 6}}>
                        <TextInput
                          style={[styles.cellInput, styles.brandCellInput]}
                          value={item.brand || ''}
                          placeholder="Brand (optional)"
                          placeholderTextColor="#8B938E"
                          onFocus={() =>
                            setActiveDropdown({itemId: item.id, field: 'brand'})
                          }
                          onChangeText={b => {
                            handleUpdateLine(item.id, 'brand', b);
                            setActiveDropdown({itemId: item.id, field: 'brand'});
                          }}
                        />

                        {isBrandOpen && (
                          <View style={[styles.recomPopover, {width: 180}]}>
                            <View style={styles.recomHeaderBar}>
                              <Text style={styles.recomHeaderText}>Brands</Text>
                              <Pressable onPress={() => setActiveDropdown(null)}>
                                <Text style={styles.recomCloseBtn}>✕</Text>
                              </Pressable>
                            </View>
                            {filteredBrands.map(b => (
                              <Pressable
                                key={b}
                                style={styles.recomRow}
                                onPress={() => handleSelectBrand(item.id, b)}>
                                <Text style={styles.recomRowTitle}>{b}</Text>
                              </Pressable>
                            ))}
                            <Pressable
                              style={styles.recomRow}
                              onPress={() => handleSelectBrand(item.id, '')}>
                              <Text style={[styles.recomRowSub, {color: '#8B938E'}]}>Unbranded</Text>
                            </Pressable>
                          </View>
                        )}
                      </View>

                      {/* Qty kg */}
                      <View style={{width: 85, paddingRight: 6}}>
                        <TextInput
                          style={[styles.cellInput, styles.numberInput]}
                          keyboardType="numeric"
                          value={
                            editingCell?.id === item.id && editingCell.field === 'qtyKg'
                              ? editingCell.text
                              : format2Dec(item.qtyKg)
                          }
                          placeholder="0.00"
                          placeholderTextColor="#8B938E"
                          onFocus={() =>
                            setEditingCell({
                              id: item.id,
                              field: 'qtyKg',
                              text: item.qtyKg ? String(item.qtyKg) : '',
                            })
                          }
                          onBlur={() => {
                            setEditingCell(null);
                            handleUpdateLine(item.id, 'qtyKg', normalizeNum(item.qtyKg));
                          }}
                          onChangeText={c => {
                            if (/^\d*\.?\d{0,2}$/.test(c)) {
                              setEditingCell({id: item.id, field: 'qtyKg', text: c});
                              handleUpdateLine(item.id, 'qtyKg', c === '' ? 0 : parseFloat(c) || 0);
                            }
                          }}
                        />
                      </View>

                      {/* Rate / kg */}
                      <View style={{width: 95, paddingRight: 6}}>
                        <TextInput
                          style={[styles.cellInput, styles.numberInput, {textAlign: 'right'}]}
                          keyboardType="numeric"
                          value={
                            editingCell?.id === item.id && editingCell.field === 'ratePerKg'
                              ? editingCell.text
                              : format2Dec(item.ratePerKg)
                          }
                          placeholder="0.00"
                          placeholderTextColor="#8B938E"
                          onFocus={() =>
                            setEditingCell({
                              id: item.id,
                              field: 'ratePerKg',
                              text: item.ratePerKg ? String(item.ratePerKg) : '',
                            })
                          }
                          onBlur={() => {
                            setEditingCell(null);
                            handleUpdateLine(item.id, 'ratePerKg', normalizeNum(item.ratePerKg));
                          }}
                          onChangeText={r => {
                            if (/^\d*\.?\d{0,2}$/.test(r)) {
                              setEditingCell({id: item.id, field: 'ratePerKg', text: r});
                              handleUpdateLine(item.id, 'ratePerKg', r === '' ? 0 : parseFloat(r) || 0);
                            }
                          }}
                        />
                      </View>

                      {/* GST Slab Chip */}
                      <View style={{width: 75, alignItems: 'center', justifyContent: 'center', height: 36}}>
                        <View style={styles.tableGstChip}>
                          <Text style={styles.tableGstChipText}>
                            {settings.enableTax ? `${totalGstPercent}%` : '0%'}
                          </Text>
                        </View>
                      </View>

                      {/* Amount */}
                      <View style={{width: 100, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 4, height: 36}}>
                        <Text style={styles.cellAmountText}>{formatINR(item.amount)}</Text>
                      </View>

                      {/* Delete */}
                      <Pressable
                        style={{width: 28, height: 36, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => handleRemoveRow(item.id)}>
                        <Text style={styles.deleteCrossText}>✕</Text>
                      </Pressable>
                    </View>
                  );
                })}

                {/* + Add Custom Item */}
                <Pressable style={styles.addCustomItemBtn} onPress={handleAddBlankRow}>
                  <Text style={styles.addCustomItemText}>+ Add Custom Line Item</Text>
                </Pressable>
              </View>
            </View>

            {/* Payment Mode Segmented Control */}
            <View style={styles.sectionWrap}>
              <Text style={styles.fieldLabel}>Payment Mode</Text>
              <SegmentedControl
                options={[
                  {value: 'Cash', label: 'Cash Counter', icon: 'payments'},
                  {value: 'UPI', label: 'UPI / QR', icon: 'online'},
                  {value: 'Due', label: 'Credit / Due', icon: 'clock'},
                ]}
                value={paymentMode}
                onChange={setPaymentMode}
              />
            </View>
          </View>
        </ScrollView>

        {/* RIGHT COLUMN: 38% Sticky Compact Real Indian GST Tax Invoice on White Paper */}
        <View style={styles.asideContainer}>
          <View style={styles.receiptPaper}>
            {/* COLLAPSIBLE HEADER */}
            {isHeaderCollapsed ? (
              <View style={styles.invoiceHeaderCollapsed}>
                <View style={styles.collapsedLeft}>
                  <AppLogo size={20} />
                  <Text style={styles.collapsedCompanyName}>{settings.companyName}</Text>
                  <Text style={styles.collapsedInvoiceTag}>{nextBillNo}</Text>
                </View>
                <Pressable
                  style={styles.headerToggleBtn}
                  onPress={() => setIsHeaderCollapsed(false)}>
                  <Text style={styles.headerToggleText}>Show header ▾</Text>
                </Pressable>
              </View>
            ) : (
              <View style={[styles.invoiceHeaderSticky, isShortScreen && styles.invoiceHeaderStickyShort]}>
                <View style={styles.headerToggleRow}>
                  <Pressable
                    style={styles.headerToggleBtn}
                    onPress={() => setIsHeaderCollapsed(true)}>
                    <Text style={styles.headerToggleText}>Hide header ▴</Text>
                  </Pressable>
                </View>

                {/* Row 1: Logo 36px (or 28px on short screen) */}
                <View style={styles.headerLogoWrap}>
                  <AppLogo size={isShortScreen ? 28 : 36} />
                </View>

                {/* Row 2: Business name 16px / 600 */}
                <Text style={styles.invoiceCompanyName}>{settings.companyName}</Text>

                {/* Row 3: Tagline 11px muted */}
                <Text style={styles.invoiceTagline}>{settings.tagline}</Text>

                {/* Row 4: Address 11px, ONE line if it fits, otherwise 2 lines */}
                <View style={styles.addressWrap}>
                  <Text style={styles.invoiceAddressText} numberOfLines={isShortScreen ? 1 : 2}>
                    {settings.address}
                  </Text>
                </View>

                {/* Row 5: Phone and GSTIN on one centered line */}
                <View style={styles.phoneGstinRow}>
                  <Text style={styles.phoneText}>Ph: {settings.phone}</Text>
                  <View style={styles.verticalDivider} />
                  <Text style={styles.gstinLabel}>
                    GSTIN: <Text style={styles.gstinVal}>{settings.gstin}</Text>
                  </Text>
                </View>

                {/* TAX INVOICE label 11px / 600 */}
                <View style={styles.taxInvoiceHeaderRow}>
                  <View style={styles.taxRule} />
                  <Text style={styles.taxInvoiceTitle}>TAX INVOICE</Text>
                  <View style={styles.taxRule} />
                </View>
              </View>
            )}

            {/* SCROLLABLE INVOICE BODY: Scrolls only when content really overflows */}
            <ScrollView
              style={styles.receiptScrollArea}
              contentContainerStyle={styles.receiptScrollContent}
              showsVerticalScrollIndicator={true}>

              {/* COMPACT META ROW: Single row, 2 columns, max 50px */}
              <View style={styles.metaRow}>
                <View style={styles.metaLeftCol}>
                  <Text style={styles.metaSectionLabel}>BILLED TO</Text>
                  <Text style={styles.metaCustomerName} numberOfLines={1}>
                    {customerName.trim() || 'Walk-in Customer'}
                  </Text>
                  {customerPhone ? (
                    <Text style={styles.metaPhoneText}>Ph: {customerPhone}</Text>
                  ) : null}
                </View>

                <View style={styles.metaRightCol}>
                  <View style={styles.metaInvoiceNumLine}>
                    <Text style={styles.metaInvoiceNumLabel}>INVOICE NO. </Text>
                    <Text style={styles.metaInvoiceNumVal}>{nextBillNo}</Text>
                  </View>
                  <View style={styles.metaDateAndChipRow}>
                    <Text style={styles.metaDateTimeText}>
                      {currentDate}, {currentTime}
                    </Text>
                    <View style={styles.paymentChip}>
                      <AppIcon name="check" size={10} color="#1F6B4F" />
                      <Text style={styles.paymentChipText}>
                        Paid by {paymentMode === 'Due' ? 'Credit' : paymentMode}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* COMPACT ITEMS TABLE: 28px header, 40px rows, max-height 170px scroll if >4 items */}
              <View style={styles.itemsTable}>
                <View style={styles.itHeaderRow}>
                  <Text style={[styles.itTh, {flex: 2.2}]}>ITEM</Text>
                  <Text style={[styles.itTh, {width: 44, textAlign: 'right'}]}>HSN</Text>
                  <Text style={[styles.itTh, {width: 58, textAlign: 'right'}]}>QTY</Text>
                  <Text style={[styles.itTh, {width: 62, textAlign: 'right'}]}>RATE</Text>
                  <Text style={[styles.itTh, {width: 76, textAlign: 'right'}]}>AMOUNT</Text>
                </View>

                <ScrollView
                  style={lineItems.length > 4 ? styles.tableScrollBody : undefined}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}>
                  {lineItems.map((it, idx) => (
                    <View key={it.id || idx} style={styles.itRow}>
                      <View style={{flex: 2.2}}>
                        <Text style={styles.itItemName} numberOfLines={1}>
                          {it.variety}
                        </Text>
                        {it.brand ? (
                          <Text style={styles.itBrandText} numberOfLines={1}>{it.brand}</Text>
                        ) : null}
                      </View>
                      <Text style={[styles.itCell, {width: 44, textAlign: 'right', color: '#8B938E'}]}>
                        {settings.hsnCode}
                      </Text>
                      <Text style={[styles.itCell, {width: 58, textAlign: 'right'}]}>
                        {format2Dec(it.qtyKg)} kg
                      </Text>
                      <Text style={[styles.itCell, {width: 62, textAlign: 'right'}]}>
                        ₹{format2Dec(it.ratePerKg)}
                      </Text>
                      <Text style={[styles.itCellBold, {width: 76, textAlign: 'right'}]}>
                        {formatINR(it.amount)}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* COMPACT TOTALS: Full panel width (100%), 24px rows, tabular numbers */}
              <View style={styles.totalsBlockWrap}>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>
                    Gross Items Total ({format2Dec(totalQtyKg)} kg)
                  </Text>
                  <Text style={styles.totalsVal}>{formatINR(grossSubtotal)}</Text>
                </View>

                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>Trade Discount</Text>
                  <View style={styles.discountInputBox}>
                    <TextInput
                      style={styles.discountField}
                      keyboardType="numeric"
                      placeholder="0.00"
                      placeholderTextColor="#8B938E"
                      value={discountStr}
                      onChangeText={txt => {
                        if (/^\d*\.?\d{0,2}$/.test(txt)) {
                          setDiscountStr(txt);
                        }
                      }}
                    />
                  </View>
                </View>

                <View style={styles.totalsHairline} />

                <View style={styles.totalsRow}>
                  <Text style={[styles.totalsLabel, {fontWeight: '600', color: '#1F2421'}]}>
                    Taxable Subtotal
                  </Text>
                  <Text style={[styles.totalsVal, {fontWeight: '600'}]}>
                    {formatINR(taxableAmount)}
                  </Text>
                </View>

                {settings.enableTax && (
                  <>
                    {isShortScreen ? (
                      /* Combined CGST + SGST row when screen height is under 880px to save vertical space */
                      <View style={styles.totalsRow}>
                        <Text style={styles.totalsLabel}>
                          CGST {cgstPercent}% + SGST {sgstPercent}%
                          <Text style={styles.taxOnHelper}> on {formatINR(taxableAmount)}</Text>
                        </Text>
                        <Text style={styles.totalsVal}>
                          {formatINR(cgstAmount)} + {formatINR(sgstAmount)}
                        </Text>
                      </View>
                    ) : (
                      <>
                        <View style={styles.totalsRow}>
                          <Text style={styles.totalsLabel}>
                            CGST ({cgstPercent}%)
                            <Text style={styles.taxOnHelper}> on {formatINR(taxableAmount)}</Text>
                          </Text>
                          <Text style={styles.totalsVal}>{formatINR(cgstAmount)}</Text>
                        </View>

                        <View style={styles.totalsRow}>
                          <Text style={styles.totalsLabel}>
                            SGST ({sgstPercent}%)
                            <Text style={styles.taxOnHelper}> on {formatINR(taxableAmount)}</Text>
                          </Text>
                          <Text style={styles.totalsVal}>{formatINR(sgstAmount)}</Text>
                        </View>
                      </>
                    )}

                    <View style={styles.totalsRow}>
                      <Text style={[styles.totalsLabel, {fontWeight: '600', color: '#1F6B4F'}]}>
                        Total GST
                      </Text>
                      <Text style={[styles.totalsVal, {fontWeight: '600', color: '#1F6B4F'}]}>
                        {formatINR(totalTax)}
                      </Text>
                    </View>
                  </>
                )}

                {settings.enableRoundOff && (
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Round-off</Text>
                    <Text style={styles.totalsVal}>
                      {roundOff > 0 ? `+${formatINR(roundOff)}` : formatINR(roundOff)}
                    </Text>
                  </View>
                )}
              </View>

              {/* NET PAYABLE BAND: 56px height, 26px font */}
              <View style={styles.netPayableBand}>
                <View>
                  <Text style={styles.netPayableHeading}>Net Payable</Text>
                  <Text style={styles.netPayableSubtitle}>
                    Taxable + GST {settings.enableTax ? `${totalGstPercent}%` : '0%'}
                  </Text>
                </View>
                <Text style={styles.netPayableHeroNumber}>{formatINR(grandTotal)}</Text>
              </View>

              {/* Amount in words: 11px italic */}
              <View style={styles.wordsRow}>
                <Text style={styles.wordsLabel}>AMOUNT IN WORDS</Text>
                <Text style={styles.wordsItalicText} numberOfLines={2}>
                  {numberToWordsINR(grandTotal)}
                </Text>
              </View>

              {/* FOOTER NOTE */}
              <View style={styles.footerWrap}>
                <View style={styles.footerHairline} />
                <Text style={styles.footerNoticeText} numberOfLines={2}>
                  Thank you for your business. Rice once sold cannot be returned without the original receipt.
                </Text>
              </View>
            </ScrollView>

            {/* PINNED BOTTOM ACTION BAR: 52px high, 36px buttons, 13px font */}
            <View style={styles.pinnedActionBar}>
              <Pressable
                style={({pressed}) => [
                  styles.actionBtnGhost,
                  pressed && styles.actionBtnGhostPressed,
                ]}
                onPress={handleResetBill}>
                <Text style={styles.actionBtnGhostText}>Reset</Text>
              </Pressable>

              <View style={styles.actionRightButtons}>
                <Pressable
                  style={({pressed}) => [
                    styles.actionBtnOutlined,
                    pressed && styles.actionBtnOutlinedPressed,
                  ]}
                  onPress={handleSaveAndPrintBill}>
                  <Text style={styles.actionBtnOutlinedText}>Save</Text>
                  <View style={styles.btnDivider} />
                  <Text style={styles.btnShortcutMuted}>Ctrl+S</Text>
                </Pressable>

                <Pressable
                  style={({pressed}) => [
                    styles.actionBtnPrimary,
                    pressed && styles.actionBtnPrimaryPressed,
                    isSaving && styles.actionBtnPrimaryDisabled,
                  ]}
                  disabled={isSaving}
                  onPress={handleSaveAndPrintBill}>
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" style={{marginRight: 6}} />
                  ) : (
                    <AppIcon name="print" size={14} color="#FFFFFF" style={{marginRight: 6}} />
                  )}
                  <Text style={styles.actionBtnPrimaryText}>Save & Print GST Invoice</Text>
                  <View style={styles.btnDividerPrimary} />
                  <Text style={styles.btnShortcutPrimary}>Ctrl+P</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F5F2', // Warm off-white
  },
  posSplitContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  leftPane: {
    flex: 1,
  },
  leftPaneContent: {
    paddingBottom: 20,
  },
  statusStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E4DD',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 12,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2421',
  },
  taxChip: {
    backgroundColor: '#F0EFEA',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderWidth: 1,
    borderColor: '#E7E4DD',
  },
  taxChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F6B4F',
  },
  statusActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ghostActionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#F6F5F2',
    borderWidth: 1,
    borderColor: '#E7E4DD',
  },
  ghostActionBtnPressed: {
    backgroundColor: '#EAE7E0',
  },
  ghostActionBtnText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5E6661',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7E4DD',
    padding: 16,
    gap: 14,
  },
  customerRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E4DD',
  },
  fieldCol: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5E6661',
  },
  reqMarker: {
    color: '#C0392B',
  },
  textInput: {
    height: 38,
    borderWidth: 1,
    borderColor: '#E7E4DD',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#1F2421',
    backgroundColor: '#FFFFFF',
  },
  sectionWrap: {
    gap: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2421',
  },
  sectionMutedCount: {
    fontSize: 11.5,
    color: '#8B938E',
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  varietyTile: {
    width: '32%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E4DD',
    borderRadius: 6,
    padding: 10,
    gap: 5,
  },
  varietyTilePressed: {
    borderColor: '#1F6B4F',
    backgroundColor: '#FBFBF9',
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  tileTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1F2421',
    flex: 1,
  },
  tileBrandChip: {
    backgroundColor: '#F0EFEA',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  tileBrandText: {
    fontSize: 10,
    color: '#5E6661',
    fontWeight: '500',
  },
  tileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tileRate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F6B4F',
    fontVariant: ['tabular-nums'],
  },
  tileStockQty: {
    fontSize: 11,
    color: '#8B938E',
    fontVariant: ['tabular-nums'],
  },
  stockLevelBarTrack: {
    height: 2.5,
    backgroundColor: '#E7E4DD',
    borderRadius: 1.5,
    overflow: 'hidden',
    marginTop: 2,
  },
  stockLevelBarFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  tableCard: {
    borderWidth: 1,
    borderColor: '#E7E4DD',
    borderRadius: 6,
    overflow: 'visible',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBFBF9',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E4DD',
  },
  th: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5E6661',
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  cellInput: {
    height: 34,
    borderWidth: 1,
    borderColor: '#E7E4DD',
    borderRadius: 5,
    paddingHorizontal: 8,
    fontSize: 12.5,
    color: '#1F2421',
    backgroundColor: '#FFFFFF',
    paddingVertical: 0,
  },
  brandCellInput: {
    backgroundColor: '#FBFBF9',
    color: '#5E6661',
  },
  numberInput: {
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    fontWeight: '500',
  },
  inStockHelperText: {
    fontSize: 10.5,
    color: '#8B938E',
    marginTop: 1,
  },
  tableGstChip: {
    backgroundColor: '#F0EFEA',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  tableGstChipText: {
    fontSize: 10.5,
    fontWeight: '500',
    color: '#5E6661',
  },
  cellAmountText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2421',
    fontVariant: ['tabular-nums'],
  },
  deleteCrossText: {
    fontSize: 13,
    color: '#8B938E',
    fontWeight: '500',
  },
  addCustomItemBtn: {
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#FAF9F6',
    borderTopWidth: 1,
    borderTopColor: '#E7E4DD',
  },
  addCustomItemText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F6B4F',
  },
  recomPopover: {
    position: 'absolute',
    top: 38,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    shadowColor: '#101814',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 9999,
  },
  recomHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6F5F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E4DD',
  },
  recomHeaderText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#5E6661',
  },
  recomCloseBtn: {
    fontSize: 11,
    color: '#8B938E',
  },
  recomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  recomRowTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2421',
  },
  recomRowSub: {
    fontSize: 10.5,
    color: '#8B938E',
  },
  recomRowRate: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#1F6B4F',
    fontVariant: ['tabular-nums'],
  },

  // RIGHT COLUMN: 38% Sticky Compact Real Indian GST Tax Invoice on White Paper
  asideContainer: {
    width: '38%',
    minWidth: 380,
    maxWidth: 460,
    height: '100%',
  },
  receiptPaper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7E4DD',
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    shadowColor: 'rgba(16, 24, 20, 0.04)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },

  // COLLAPSED HEADER: 38px single row
  invoiceHeaderCollapsed: {
    height: 38,
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E4DD',
    backgroundColor: '#FAFAF8',
  },
  collapsedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  collapsedCompanyName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2421',
  },
  collapsedInvoiceTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F6B4F',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
    fontVariant: ['tabular-nums'],
  },
  headerToggleRow: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  headerToggleBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: '#F6F5F2',
  },
  headerToggleText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#5E6661',
  },

  // COMPACT STICKY HEADER (Target height ~120px)
  invoiceHeaderSticky: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E4DD',
    backgroundColor: '#FFFFFF',
  },
  invoiceHeaderStickyShort: {
    paddingTop: 4,
    paddingBottom: 6,
  },
  headerLogoWrap: {
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceCompanyName: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: '#1F2421',
    textAlign: 'center',
    marginTop: 4,
  },
  invoiceTagline: {
    fontSize: 11,
    fontWeight: '400',
    color: '#8B938E',
    textAlign: 'center',
    marginTop: 2,
  },
  addressWrap: {
    maxWidth: '92%',
    alignItems: 'center',
    marginTop: 3,
  },
  invoiceAddressText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#5E6661',
    textAlign: 'center',
    lineHeight: 15,
  },
  phoneGstinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 2,
  },
  phoneText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#5E6661',
  },
  verticalDivider: {
    width: 1,
    height: 10,
    backgroundColor: '#E7E4DD',
  },
  gstinLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: '#5E6661',
  },
  gstinVal: {
    fontWeight: '500',
    color: '#1F2421',
    fontVariant: ['tabular-nums'],
  },
  taxInvoiceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
    marginVertical: 6,
  },
  taxRule: {
    height: 1,
    flex: 1,
    maxWidth: 40,
    backgroundColor: '#E7E4DD',
  },
  taxInvoiceTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: '#1F6B4F',
    textTransform: 'uppercase',
  },

  // SCROLLABLE BODY
  receiptScrollArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  receiptScrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
  },

  // COMPACT META ROW (max 56px height)
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minHeight: 44,
    maxHeight: 56,
    marginBottom: 8,
  },
  metaLeftCol: {
    flex: 1,
    paddingRight: 8,
  },
  metaSectionLabel: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.4,
    color: '#8B938E',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaCustomerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2421',
  },
  metaPhoneText: {
    fontSize: 11,
    color: '#8B938E',
    marginTop: 1,
  },
  metaRightCol: {
    alignItems: 'flex-end',
  },
  metaInvoiceNumLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 2,
  },
  metaInvoiceNumLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8B938E',
    textTransform: 'uppercase',
  },
  metaInvoiceNumVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F6B4F',
    fontVariant: ['tabular-nums'],
  },
  metaDateAndChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 1,
  },
  metaDateTimeText: {
    fontSize: 11,
    color: '#8B938E',
  },
  paymentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E7E4DD',
    backgroundColor: '#FAFAF8',
  },
  paymentChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5E6661',
  },

  // COMPACT ITEMS TABLE: 28px header, 40px rows, max 170px scroll if >4 items
  itemsTable: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E7E4DD',
    marginBottom: 8,
  },
  itHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E4DD',
  },
  itTh: {
    fontSize: 10,
    fontWeight: '500',
    color: '#8B938E',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  tableScrollBody: {
    maxHeight: 170,
  },
  itRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    paddingVertical: 4.5,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFEA',
  },
  itItemName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2421',
  },
  itBrandText: {
    fontSize: 11,
    color: '#8B938E',
    marginTop: 1,
  },
  itCell: {
    fontSize: 12,
    color: '#5E6661',
    fontVariant: ['tabular-nums'],
  },
  itCellBold: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2421',
    fontVariant: ['tabular-nums'],
  },

  // COMPACT TOTALS BLOCK: Full panel width (100%), 24px rows
  totalsBlockWrap: {
    width: '100%',
    marginBottom: 6,
  },
  totalsRow: {
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalsLabel: {
    fontSize: 12,
    color: '#5E6661',
  },
  taxOnHelper: {
    fontSize: 10,
    color: '#8B938E',
    fontWeight: '400',
  },
  totalsVal: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2421',
    fontVariant: ['tabular-nums'],
  },
  discountInputBox: {
    width: 80,
    height: 24,
    borderWidth: 1,
    borderColor: '#E7E4DD',
    borderRadius: 4,
    paddingHorizontal: 6,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  discountField: {
    height: 22,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
    color: '#1F2421',
    fontVariant: ['tabular-nums'],
    padding: 0,
  },
  totalsHairline: {
    height: 1,
    backgroundColor: '#E7E4DD',
    marginVertical: 3,
  },

  // NET PAYABLE BAND: 56px height, 26px font
  netPayableBand: {
    height: 56,
    backgroundColor: '#F1F7F4',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(31, 107, 79, 0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginHorizontal: -18, // Spans full width of receipt paper
    marginVertical: 6,
  },
  netPayableHeading: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2421',
  },
  netPayableSubtitle: {
    fontSize: 11,
    color: '#8B938E',
    marginTop: 1,
  },
  netPayableHeroNumber: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1F6B4F',
    fontVariant: ['tabular-nums'],
  },

  // AMOUNT IN WORDS
  wordsRow: {
    marginTop: 6,
    marginBottom: 6,
  },
  wordsLabel: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.4,
    color: '#8B938E',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  wordsItalicText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#5E6661',
    lineHeight: 15,
  },

  // FOOTER NOTE & SIGNATORY
  footerWrap: {
    marginTop: 8,
  },
  footerHairline: {
    height: 1,
    backgroundColor: '#E7E4DD',
    marginBottom: 8,
  },
  footerNoticeText: {
    fontSize: 10,
    color: '#8B938E',
    textAlign: 'center',
    lineHeight: 14,
  },
  signatoryBlock: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  signatoryLine: {
    width: 140,
    height: 1,
    backgroundColor: '#E7E4DD',
    marginBottom: 6,
  },
  signatoryLabel: {
    fontSize: 11,
    color: '#8B938E',
  },

  // PINNED BOTTOM ACTION BAR: 52px high, 36px buttons, 13px font
  pinnedActionBar: {
    height: 52,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: '#E7E4DD',
    backgroundColor: '#FFFFFF',
  },
  actionBtnGhost: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnGhostPressed: {
    backgroundColor: '#F6F5F2',
  },
  actionBtnGhostText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5E6661',
  },
  actionRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnOutlined: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E4DD',
    gap: 6,
  },
  actionBtnOutlinedPressed: {
    backgroundColor: '#F6F5F2',
  },
  actionBtnOutlinedText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2421',
  },
  btnDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#E7E4DD',
  },
  btnShortcutMuted: {
    fontSize: 10,
    color: '#8B938E',
  },
  actionBtnPrimary: {
    height: 36,
    minWidth: 190,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F6B4F',
    borderRadius: 6,
    paddingHorizontal: 14,
    gap: 6,
  },
  actionBtnPrimaryPressed: {
    backgroundColor: '#185A42',
  },
  actionBtnPrimaryDisabled: {
    opacity: 0.7,
  },
  actionBtnPrimaryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  btnDividerPrimary: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  btnShortcutPrimary: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
  },
});

export default OfflineScreen;
