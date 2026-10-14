import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import {AppLogo} from '../../shared/components/AppLogo';
import {
  StoreOrder,
  BillItem,
  StockItem,
  PaymentMode,
} from './types';

// Live stock items from user's pgAdmin database (exact 3 items)
const INITIAL_STOCK: StockItem[] = [
  {id: 'stk-10', riceName: 'Seeraga Samba', quantity: 500, pricePerKg: 75, brand: 'Annam'},
  {id: 'stk-11', riceName: 'Karuppu Kavuni', quantity: 300, pricePerKg: 90, brand: 'Organic Tattva'},
  {id: 'stk-12', riceName: 'Maappillai Samba', quantity: 400, pricePerKg: 80, brand: 'Double Horse'},
];

// Strictly format any number to exactly 2 decimal places (e.g. 75.00000 -> 75.00)
const format2Dec = (val: any): string => {
  const n = parseFloat(String(val ?? 0));
  return isNaN(n) ? '0.00' : n.toFixed(2);
};

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

// Normalize numeric value to a 2-decimal rounded number
const normalizeNum = (val: any): number => {
  const n = parseFloat(String(val ?? 0));
  return isNaN(n) ? 0 : parseFloat(n.toFixed(2));
};

const API_BASE_URL = 'http://localhost:5000/api';

export const OfflineScreen: React.FC = () => {
  const [bills, setBills] = useState<StoreOrder[]>([]);
  const [stock, setStock] = useState<StockItem[]>(INITIAL_STOCK);
  const [isWsConnected, setIsWsConnected] = useState(false);

  // Active autocomplete recommendation popover state
  const [activeDropdown, setActiveDropdown] = useState<{
    itemId: string;
    field: 'variety' | 'brand';
  } | null>(null);

  // Active input editing state to avoid premature formatting while typing
  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: 'qtyKg' | 'ratePerKg';
    text: string;
  } | null>(null);

  // Customer Walk-in Details
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Cash');
  const [discountStr, setDiscountStr] = useState('');

  // Items table: Rice Variety, Brand (optional), Qty (kg), Rate/kg, Amount (strict 2 decimal points)
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

  // Real-time live synchronization (WebSocket + REST fallback)
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket('ws://localhost:5000');
      ws.onopen = () => {
        setIsWsConnected(true);
      };
      ws.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'STOCK_UPDATE' && Array.isArray(data.stock)) {
            setStock(data.stock);
          }
        } catch (_err) {}
      };
      ws.onerror = () => setIsWsConnected(false);
      ws.onclose = () => setIsWsConnected(false);
    } catch (_e) {
      setIsWsConnected(false);
    }

    // Also fetch initial stock from local REST API if available
    fetch(`${API_BASE_URL}/stock`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setStock(data);
        }
      })
      .catch(() => {});

    return () => {
      if (ws) {
        try {
          ws.close();
        } catch (_) {}
      }
    };
  }, []);

  // Distinct brands currently available in stock
  const allBrands = useMemo(() => {
    const brandSet = new Set<string>();
    stock.forEach(s => {
      if (s.brand && s.brand.trim()) {
        brandSet.add(s.brand.trim());
      }
    });
    return Array.from(brandSet);
  }, [stock]);

  // Find stock item by exact variety name
  const findStock = (varietyName: string): StockItem | undefined => {
    return stock.find(
      s => s.riceName.toLowerCase() === varietyName.trim().toLowerCase(),
    );
  };

  // Get matching stock varieties for autocomplete recommendation
  const getFilteredVarieties = (query: string): StockItem[] => {
    const q = query.trim().toLowerCase();
    if (!q) return stock;
    return stock.filter(
      s =>
        s.riceName.toLowerCase().includes(q) ||
        (s.brand && s.brand.toLowerCase().includes(q)),
    );
  };

  // Get matching brands for autocomplete recommendation
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

  // Autocomplete selection for Variety
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

  // Autocomplete selection for Brand
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

  // Live Calculations (limited to 2 decimal places)
  const subtotal = useMemo(() => {
    const sum = lineItems.reduce((acc, it) => acc + (it.amount || 0), 0);
    return parseFloat(sum.toFixed(2));
  }, [lineItems]);

  const totalQtyKg = useMemo(() => {
    const sum = lineItems.reduce((acc, it) => acc + (it.qtyKg || 0), 0);
    return parseFloat(sum.toFixed(2));
  }, [lineItems]);

  const discount = useMemo(() => {
    const d = parseFloat(discountStr) || 0;
    return parseFloat(d.toFixed(2));
  }, [discountStr]);

  const grandTotal = useMemo(() => {
    return Math.max(0, parseFloat((subtotal - discount).toFixed(2)));
  }, [subtotal, discount]);

  const nextBillNo = `BILL-${String(1001 + bills.length).padStart(4, '0')}`;
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
    if (lineItems.length === 0 || subtotal <= 0) {
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
      subtotal,
      discount,
      grandTotal,
      paymentMode,
      paymentStatus: paymentMode === 'Due' ? 'Pending' : 'Paid',
      syncStatus: 'synced',
      createdAt: `${currentDate}, ${currentTime}`,
    };

    try {
      fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newBill),
      }).catch(() => {});
    } catch (_e) {}

    setBills([newBill, ...bills]);

    Alert.alert(
      'Bill Saved & Printed',
      `${newBill.orderNo} for ${formatINR(grandTotal)} created!\nStock deducted: ${format2Dec(totalQtyKg)} kg.`,
    );

    // Reset for next customer
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

  return (
    <View style={styles.container}>
      {/* SPLIT POS LAYOUT — ENTRY ON LEFT, BILL ASIDE ON RIGHT */}
      <View style={styles.posSplitContainer}>
        {/* LEFT COLUMN: Fast Biller Entry Area (60% width) */}
        <ScrollView style={styles.leftPane} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.posCard}>
            {/* Customer Walk-in Bar */}
            <View style={styles.customerBar}>
              <View style={[styles.fieldCol, {flex: 2}]}>
                <Text style={styles.label}>
                  Customer / Buyer Name <Text style={styles.req}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter name (e.g. Ramesh or Walk-in Customer)"
                  placeholderTextColor="#94A3B8"
                  value={customerName}
                  onChangeText={setCustomerName}
                />
              </View>

              <View style={styles.fieldCol}>
                <Text style={styles.label}>Mobile No. (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="10-digit phone"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                />
              </View>
            </View>

            {/* Quick Add from Stock Chips (Shows brand if present) */}
            <View style={styles.quickVarietySection}>
              <Text style={styles.subLabel}>
                Quick Add Rice Variety from Stock:
              </Text>
              <View style={styles.chipList}>
                {stock.map(s => (
                  <Pressable
                    key={s.id}
                    style={styles.stockChip}
                    onPress={() => handleAddStockItem(s)}>
                    <Text style={styles.stockChipTitle}>
                      + {s.riceName}
                      {s.brand ? ` (${s.brand})` : ''}
                    </Text>
                    <View style={styles.stockChipMeta}>
                      <Text style={styles.stockChipRate}>₹{format2Dec(s.pricePerKg)}/kg</Text>
                      <Text style={styles.stockChipQty}>• {format2Dec(s.quantity)} kg left</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Items Table: HEADINGS WITH NUMBERS REMOVED */}
            <View style={styles.itemsTable}>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, {flex: 1.5}]}>RICE VARIETY</Text>
                <Text style={[styles.th, {flex: 1.1}]}>BRAND (OPTIONAL)</Text>
                <Text style={[styles.th, {width: 100, textAlign: 'center'}]}>QTY (KG)</Text>
                <Text style={[styles.th, {width: 110, textAlign: 'right'}]}>RATE / KG (₹)</Text>
                <Text style={[styles.th, {width: 125, textAlign: 'right'}]}>AMOUNT (₹)</Text>
                <Text style={[styles.th, {width: 38, textAlign: 'center'}]}></Text>
              </View>

              {lineItems.map(item => {
                const stockMatch = findStock(item.variety);
                const isVarietyDropdownOpen =
                  activeDropdown?.itemId === item.id && activeDropdown?.field === 'variety';
                const isBrandDropdownOpen =
                  activeDropdown?.itemId === item.id && activeDropdown?.field === 'brand';
                const filteredVarieties = getFilteredVarieties(item.variety || '');
                const filteredBrands = getFilteredBrands(item.brand || '');

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.tableRow,
                      {
                        zIndex: isVarietyDropdownOpen || isBrandDropdownOpen ? 999 : 1,
                        elevation: isVarietyDropdownOpen || isBrandDropdownOpen ? 10 : 1,
                      },
                    ]}>
                    {/* Rice Variety Input with Autocomplete Recommendations */}
                    <View style={styles.colVariety}>
                      <TextInput
                        style={styles.rowInput}
                        value={item.variety}
                        placeholder="Type variety (e.g. Womale)"
                        placeholderTextColor="#94A3B8"
                        onFocus={() =>
                          setActiveDropdown({itemId: item.id, field: 'variety'})
                        }
                        onChangeText={v => {
                          handleUpdateLine(item.id, 'variety', v);
                          setActiveDropdown({itemId: item.id, field: 'variety'});
                        }}
                      />
                      {stockMatch && !isVarietyDropdownOpen && (
                        <Text style={styles.rowStockHelper}>
                          Stock: {format2Dec(stockMatch.quantity)} kg
                          {stockMatch.brand ? ` • Brand: ${stockMatch.brand}` : ''}
                        </Text>
                      )}

                      {/* Rice Variety Recommendation Panel */}
                      {isVarietyDropdownOpen && (
                        <View style={styles.recomPopover}>
                          <View style={styles.recomHeaderBar}>
                            <Text style={styles.recomHeaderText}>
                              RECOMMENDED VARIETIES ({filteredVarieties.length})
                            </Text>
                            <Pressable onPress={() => setActiveDropdown(null)}>
                              <Text style={styles.recomCloseBtn}>✕</Text>
                            </Pressable>
                          </View>
                          <View style={styles.recomListWrap}>
                            {filteredVarieties.length === 0 ? (
                              <View style={styles.recomEmpty}>
                                <Text style={styles.recomEmptyText}>
                                  No exact stock match
                                </Text>
                                <Text style={styles.recomEmptySub}>
                                  Press Tab or click to use: "{item.variety}"
                                </Text>
                              </View>
                            ) : (
                              filteredVarieties.map(stk => (
                                <Pressable
                                  key={stk.id}
                                  style={styles.recomItemRow}
                                  onPress={() => handleSelectVariety(item.id, stk)}>
                                  <View style={{flex: 1}}>
                                    <Text style={styles.recomTitle}>
                                      {stk.riceName}
                                    </Text>
                                    {stk.brand ? (
                                      <Text style={styles.recomBrand}>
                                        Brand: {stk.brand}
                                      </Text>
                                    ) : (
                                      <Text style={styles.recomNoBrand}>
                                        Unbranded
                                      </Text>
                                    )}
                                  </View>
                                  <View style={{alignItems: 'flex-end'}}>
                                    <Text style={styles.recomRate}>
                                      ₹{format2Dec(stk.pricePerKg)}/kg
                                    </Text>
                                    <Text style={styles.recomStockQty}>
                                      {format2Dec(stk.quantity)} kg in stock
                                    </Text>
                                  </View>
                                </Pressable>
                              ))
                            )}
                          </View>
                        </View>
                      )}
                    </View>

                    {/* Brand Input with Autocomplete Recommendations */}
                    <View style={styles.colBrand}>
                      <TextInput
                        style={[styles.rowInput, styles.brandInput]}
                        value={item.brand || ''}
                        placeholder="Brand (optional)"
                        placeholderTextColor="#94A3B8"
                        onFocus={() =>
                          setActiveDropdown({itemId: item.id, field: 'brand'})
                        }
                        onChangeText={b => {
                          handleUpdateLine(item.id, 'brand', b);
                          setActiveDropdown({itemId: item.id, field: 'brand'});
                        }}
                      />

                      {/* Brand Recommendation Panel */}
                      {isBrandDropdownOpen && (
                        <View style={[styles.recomPopover, styles.brandPopover]}>
                          <View style={styles.recomHeaderBar}>
                            <Text style={styles.recomHeaderText}>
                              RECOMMENDED BRANDS
                            </Text>
                            <Pressable onPress={() => setActiveDropdown(null)}>
                              <Text style={styles.recomCloseBtn}>✕</Text>
                            </Pressable>
                          </View>
                          <View style={styles.recomListWrap}>
                            {filteredBrands.map(b => (
                              <Pressable
                                key={b}
                                style={styles.recomItemRow}
                                onPress={() => handleSelectBrand(item.id, b)}>
                                <Text style={styles.recomTitle}>🏷️ {b}</Text>
                              </Pressable>
                            ))}
                            <Pressable
                              style={[
                                styles.recomItemRow,
                                {backgroundColor: '#F8FAFC'},
                              ]}
                              onPress={() => handleSelectBrand(item.id, '')}>
                              <Text style={[styles.recomTitle, {color: '#64748B'}]}>
                                ✕ No Brand (Unbranded)
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      )}
                    </View>

                    {/* Qty (kg) */}
                    <View style={{width: 100, paddingRight: 6}}>
                      <TextInput
                        style={[
                          styles.rowInput,
                          {textAlign: 'center', fontWeight: '700'},
                        ]}
                        keyboardType="numeric"
                        value={
                          editingCell?.id === item.id && editingCell.field === 'qtyKg'
                            ? editingCell.text
                            : format2Dec(item.qtyKg)
                        }
                        placeholder="0.00"
                        placeholderTextColor="#94A3B8"
                        onFocus={() =>
                          setEditingCell({
                            id: item.id,
                            field: 'qtyKg',
                            text: item.qtyKg ? String(item.qtyKg) : '',
                          })
                        }
                        onBlur={() => {
                          setEditingCell(null);
                          handleUpdateLine(
                            item.id,
                            'qtyKg',
                            normalizeNum(item.qtyKg),
                          );
                        }}
                        onChangeText={c => {
                          if (/^\d*\.?\d{0,2}$/.test(c)) {
                            setEditingCell({
                              id: item.id,
                              field: 'qtyKg',
                              text: c,
                            });
                            handleUpdateLine(
                              item.id,
                              'qtyKg',
                              c === '' ? 0 : parseFloat(c) || 0,
                            );
                          }
                        }}
                      />
                    </View>

                    {/* Rate / kg (₹) */}
                    <View style={{width: 110, paddingRight: 6}}>
                      <TextInput
                        style={[styles.rowInput, {textAlign: 'right'}]}
                        keyboardType="numeric"
                        value={
                          editingCell?.id === item.id && editingCell.field === 'ratePerKg'
                            ? editingCell.text
                            : format2Dec(item.ratePerKg)
                        }
                        placeholder="0.00"
                        placeholderTextColor="#94A3B8"
                        onFocus={() =>
                          setEditingCell({
                            id: item.id,
                            field: 'ratePerKg',
                            text: item.ratePerKg ? String(item.ratePerKg) : '',
                          })
                        }
                        onBlur={() => {
                          setEditingCell(null);
                          handleUpdateLine(
                            item.id,
                            'ratePerKg',
                            normalizeNum(item.ratePerKg),
                          );
                        }}
                        onChangeText={r => {
                          if (/^\d*\.?\d{0,2}$/.test(r)) {
                            setEditingCell({
                              id: item.id,
                              field: 'ratePerKg',
                              text: r,
                            });
                            handleUpdateLine(
                              item.id,
                              'ratePerKg',
                              r === '' ? 0 : parseFloat(r) || 0,
                            );
                          }
                        }}
                      />
                    </View>

                    {/* Amount (₹) */}
                    <View
                      style={{
                        width: 125,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        paddingRight: 6,
                      }}>
                      <Text style={styles.calcAmount}>{formatINR(item.amount)}</Text>
                    </View>

                    {/* Delete Item */}
                    <Pressable
                      style={{
                        width: 38,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => handleRemoveRow(item.id)}>
                      <Text style={styles.deleteBtn}>✕</Text>
                    </Pressable>
                  </View>
                );
              })}

              {/* + Add Line Button */}
              <Pressable style={styles.addLineBtn} onPress={handleAddBlankRow}>
                <Text style={styles.addLineText}>＋ Add Custom Line Item</Text>
              </Pressable>
            </View>

            {/* Payment Mode Selector */}
            <View style={styles.paymentSection}>
              <Text style={styles.label}>Select Payment Mode</Text>
              <View style={styles.paymentTabs}>
                {(['Cash', 'UPI', 'Due'] as PaymentMode[]).map(mode => (
                  <Pressable
                    key={mode}
                    style={[
                      styles.payTab,
                      paymentMode === mode && styles.payTabActive,
                    ]}
                    onPress={() => setPaymentMode(mode)}>
                    <Text
                      style={[
                        styles.payTabText,
                        paymentMode === mode && styles.payTabTextActive,
                      ]}>
                      {mode === 'UPI'
                        ? '📱 UPI / QR'
                        : mode === 'Cash'
                        ? '💵 Cash'
                        : '⏳ Due'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* RIGHT COLUMN: THE LIVE BILL RECEIPT (ASIDE) (40% width) */}
        <View style={styles.asideContainer}>
          <View style={styles.receiptPaper}>
            {/* Professional Centered Receipt Header */}
            <View style={styles.receiptBrandHeader}>
              <View style={styles.receiptLogoContainer}>
                <AppLogo size={42} />
              </View>
              <Text style={styles.receiptCompanyName}>RICEBEE ENTERPRISES</Text>
              <Text style={styles.receiptSubTagline}>Wholesale Rice Mill & Retail Counter</Text>
              <Text style={styles.receiptAddressText}>
                1, 25, Naidu St, Kurinji Nagar, Ramapuram, Chennai - 600089
              </Text>
              <Text style={styles.receiptPhoneText}>Ph: 090926 80809</Text>
              <Text style={styles.receiptGstinText}>GSTIN: 33KMDPK6488K1ZD</Text>
              <View style={styles.invoiceTypeBadge}>
                <Text style={styles.invoiceTypeBadgeText}>RETAIL CASH / CREDIT INVOICE</Text>
              </View>
            </View>

            {/* Receipt Meta Box */}
            <View style={styles.receiptMetaGrid}>
              <View>
                <Text style={styles.rmLabel}>CUSTOMER:</Text>
                <Text style={styles.rmCustomerName} numberOfLines={1}>{customerName}</Text>
                {customerPhone ? (
                  <Text style={styles.rmDetailText}>Ph: {customerPhone}</Text>
                ) : null}
              </View>

              <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.rmBillNumber}>{nextBillNo}</Text>
                <Text style={styles.rmDetailText}>{currentDate}</Text>
                <Text style={styles.rmModeBadge}>Mode: {paymentMode}</Text>
              </View>
            </View>

            {/* Receipt Items (Brand ONLY added if mentioned!) */}
            <ScrollView style={styles.receiptItemsScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.receiptTableHead}>
                <Text style={[styles.rtTh, {flex: 2}]}>RICE VARIETY</Text>
                <Text style={[styles.rtTh, {width: 75, textAlign: 'center'}]}>QTY (KG)</Text>
                <Text style={[styles.rtTh, {width: 75, textAlign: 'right'}]}>RATE/KG</Text>
                <Text style={[styles.rtTh, {width: 90, textAlign: 'right'}]}>AMOUNT</Text>
              </View>

              {lineItems.map((it, idx) => {
                const hasBrand = it.brand && it.brand.trim().length > 0;
                return (
                  <View key={it.id || idx} style={styles.receiptTableRow}>
                    <View style={{flex: 2}}>
                      <Text style={styles.rtItemName} numberOfLines={2}>
                        {it.variety}
                      </Text>
                      {/* IF BRAND IS MENTIONED, ADD IN BILL; ELSE DONT! */}
                      {hasBrand ? (
                        <Text style={styles.rtBrandTag}>Brand: {it.brand?.trim()}</Text>
                      ) : null}
                    </View>
                    <Text style={[styles.rtItemText, {width: 75, textAlign: 'center'}]}>
                      {format2Dec(it.qtyKg)} kg
                    </Text>
                    <Text style={[styles.rtItemText, {width: 75, textAlign: 'right'}]}>
                      ₹{format2Dec(it.ratePerKg)}
                    </Text>
                    <Text style={[styles.rtItemAmount, {width: 90, textAlign: 'right'}]}>
                      {formatINR(it.amount)}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            {/* Calculation Summary Footer */}
            <View style={styles.receiptTotalsArea}>
              <View style={styles.receiptSummaryRow}>
                <Text style={styles.rstLabel}>Total Billed Weight:</Text>
                <Text style={styles.rstValue}>{format2Dec(totalQtyKg)} kg</Text>
              </View>

              <View style={styles.receiptSummaryRow}>
                <Text style={styles.rstLabel}>Subtotal:</Text>
                <Text style={styles.rstValue}>{formatINR(subtotal)}</Text>
              </View>

              {/* Mention Discount in Bill ONLY if discount is present */}
              {discount > 0 ? (
                <View style={styles.receiptSummaryRow}>
                  <Text style={styles.rstDiscountLabel}>Discount Applied:</Text>
                  <Text style={styles.rstDiscountValue}>- {formatINR(discount)}</Text>
                </View>
              ) : null}

              {/* Discount Entry Box on Right Side */}
              <View style={styles.discountControlRow}>
                <Text style={styles.discountControlLabel}>Discount (₹):</Text>
                <View style={styles.discountInputWrap}>
                  <TextInput
                    style={styles.asideDiscountInput}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    value={discountStr}
                    onBlur={() => {
                      if (discountStr.trim() !== '') {
                        const num = parseFloat(discountStr);
                        if (!isNaN(num) && num > 0) {
                          setDiscountStr(format2Dec(num));
                        }
                      }
                    }}
                    onChangeText={txt => {
                      if (/^\d*\.?\d{0,2}$/.test(txt)) {
                        setDiscountStr(txt);
                      }
                    }}
                  />
                  {discount > 0 ? (
                    <Pressable
                      style={styles.discountClearBtn}
                      onPress={() => setDiscountStr('')}>
                      <Text style={styles.discountClearText}>✕</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptGrandTotalRow}>
                <Text style={styles.receiptGrandLabel}>TOTAL PAYABLE:</Text>
                <Text style={styles.receiptGrandValue}>{formatINR(grandTotal)}</Text>
              </View>

              {/* Primary Action Button */}
              <Pressable
                style={styles.asidePrintBtn}
                onPress={handleSaveAndPrintBill}>
                <Text style={styles.asidePrintBtnIcon}>🖨️</Text>
                <Text style={styles.asidePrintBtnText}>Save & Print Bill</Text>
              </Pressable>
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
    backgroundColor: '#F3F4F6',
  },
  posSplitContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  leftPane: {
    flex: 1.35,
  },
  posCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    gap: 16,
    marginBottom: 20,
  },
  customerBar: {
    flexDirection: 'row',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 16,
  },
  fieldCol: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  req: {
    color: '#DC2626',
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  quickVarietySection: {
    gap: 8,
  },
  subLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  chipList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stockChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#93C5FD',
    gap: 3,
  },
  stockChipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1565C0',
  },
  stockChipMeta: {
    flexDirection: 'row',
    gap: 6,
  },
  stockChipRate: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  stockChipQty: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  itemsTable: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    overflow: 'visible',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  th: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  colVariety: {
    flex: 1.5,
    paddingRight: 8,
  },
  colBrand: {
    flex: 1.1,
    paddingRight: 8,
  },
  rowInput: {
    height: 42,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  brandInput: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    color: '#1565C0',
    fontWeight: '700',
  },
  rowStockHelper: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '700',
    marginTop: 4,
    marginLeft: 2,
  },
  calcAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  deleteBtn: {
    fontSize: 18,
    color: '#EF4444',
    fontWeight: '800',
  },
  addLineBtn: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  addLineText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1565C0',
  },

  // Autocomplete Recommendations Panel
  recomPopover: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#60A5FA',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  brandPopover: {
    borderColor: '#93C5FD',
  },
  recomHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
  },
  recomHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E40AF',
    letterSpacing: 0.5,
  },
  recomCloseBtn: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    paddingHorizontal: 4,
  },
  recomListWrap: {
    backgroundColor: '#FFFFFF',
  },
  recomItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  recomTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  recomBrand: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1565C0',
    marginTop: 2,
  },
  recomNoBrand: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 2,
  },
  recomRate: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  recomStockQty: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  recomEmpty: {
    padding: 12,
    alignItems: 'center',
  },
  recomEmptyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  recomEmptySub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },

  paymentSection: {
    gap: 8,
    paddingTop: 6,
  },
  paymentTabs: {
    flexDirection: 'row',
    gap: 10,
  },
  payTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  payTabActive: {
    backgroundColor: '#1565C0',
    borderColor: '#1565C0',
  },
  payTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  payTabTextActive: {
    color: '#FFFFFF',
  },

  // RIGHT PANE: ASIDE BILL RECEIPT
  asideContainer: {
    flex: 1,
    maxWidth: 440,
    minWidth: 360,
  },
  receiptPaper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 20,
    flex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    justifyContent: 'space-between',
  },
  receiptBrandHeader: {
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  receiptLogoContainer: {
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptCompanyName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  receiptSubTagline: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  receiptAddressText: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
    paddingHorizontal: 8,
  },
  receiptPhoneText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
    textAlign: 'center',
  },
  receiptGstinText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.6,
    marginTop: 3,
    textAlign: 'center',
  },
  invoiceTypeBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  invoiceTypeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  receiptMetaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 10,
  },
  rmLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  rmCustomerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  rmDetailText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  rmBillNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1565C0',
  },
  rmModeBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
    marginTop: 2,
  },
  receiptItemsScroll: {
    flex: 1,
    maxHeight: 260,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 6,
    marginVertical: 8,
  },
  receiptTableHead: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  rtTh: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  receiptTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  rtItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  rtBrandTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1565C0',
    marginTop: 2,
  },
  rtItemText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#334155',
  },
  rtItemAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  receiptTotalsArea: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    gap: 6,
  },
  receiptSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rstLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#475569',
  },
  rstValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  rstDiscountLabel: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  rstDiscountValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#DC2626',
  },
  discountControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  discountControlLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  discountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  asideDiscountInput: {
    width: 80,
    height: 32,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 5,
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  discountClearBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  discountClearText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '800',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 6,
  },
  receiptGrandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  receiptGrandLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  receiptGrandValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1565C0',
  },
  asidePrintBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 10,
    marginTop: 10,
  },
  asidePrintBtnIcon: {
    fontSize: 20,
  },
  asidePrintBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default OfflineScreen;
