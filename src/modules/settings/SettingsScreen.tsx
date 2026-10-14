import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import {typography} from '../../shared/theme/typography';
import {spacing, radii} from '../../shared/theme/spacing';
import {useSettings} from '../../shared/services/settingsService';
import {AppSettings} from './settingsTypes';
import {Switch} from '../../shared/components/Switch';
import {AppIcon} from '../../shared/components/AppIcon';

type SettingsTab = 'tax' | 'profile' | 'invoicing';

export const SettingsScreen: React.FC = () => {
  const {settings, updateSettings} = useSettings();

  const [activeTab, setActiveTab] = useState<SettingsTab>('tax');
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Check if form has unsaved edits
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(settings);
  }, [formData, settings]);

  const handleChange = (key: keyof AppSettings, val: any) => {
    setFormData(prev => ({...prev, [key]: val}));
  };

  const handleApplyPreset = (cgst: number, sgst: number) => {
    setFormData(prev => ({
      ...prev,
      enableTax: cgst + sgst > 0,
      cgstPercent: cgst,
      sgstPercent: sgst,
    }));
  };

  const handleDiscard = () => {
    setFormData(settings);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(formData);
      Alert.alert(
        'Changes Saved',
        `GST configuration (${formData.cgstPercent}% CGST + ${formData.sgstPercent}% SGST) and store profile updated successfully.`,
      );
    } catch (_e) {
      Alert.alert('Error', 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const effectiveGst = (
    (parseFloat(String(formData.cgstPercent)) || 0) +
    (parseFloat(String(formData.sgstPercent)) || 0)
  ).toFixed(2);

  return (
    <View style={styles.container}>
      {/* Settings Secondary Layout: Left Sidebar Nav + Right Content Area */}
      <View style={styles.settingsLayout}>
        {/* Left Secondary Nav (Zoho Books pattern) */}
        <View style={styles.secondaryNav}>
          <Text style={styles.navSectionHeader}>PREFERENCES</Text>

          <Pressable
            style={[styles.navTab, activeTab === 'tax' && styles.navTabActive]}
            onPress={() => setActiveTab('tax')}>
            <AppIcon
              name="settings"
              size={15}
              color={activeTab === 'tax' ? '#1F6B4F' : '#5E6661'}
              style={{marginRight: 8}}
            />
            <Text
              style={[
                styles.navTabText,
                activeTab === 'tax' && styles.navTabTextActive,
              ]}>
              GST & Tax Slabs
            </Text>
          </Pressable>

          <Pressable
            style={[styles.navTab, activeTab === 'profile' && styles.navTabActive]}
            onPress={() => setActiveTab('profile')}>
            <AppIcon
              name="customers"
              size={15}
              color={activeTab === 'profile' ? '#1F6B4F' : '#5E6661'}
              style={{marginRight: 8}}
            />
            <Text
              style={[
                styles.navTabText,
                activeTab === 'profile' && styles.navTabTextActive,
              ]}>
              Mill & Store Profile
            </Text>
          </Pressable>

          <Pressable
            style={[styles.navTab, activeTab === 'invoicing' && styles.navTabActive]}
            onPress={() => setActiveTab('invoicing')}>
            <AppIcon
              name="invoices"
              size={15}
              color={activeTab === 'invoicing' ? '#1F6B4F' : '#5E6661'}
              style={{marginRight: 8}}
            />
            <Text
              style={[
                styles.navTabText,
                activeTab === 'invoicing' && styles.navTabTextActive,
              ]}>
              Invoice Preferences
            </Text>
          </Pressable>
        </View>

        {/* Right Content Area: Two-Column Form Pattern */}
        <ScrollView
          style={styles.mainContentArea}
          contentContainerStyle={styles.contentPadding}
          showsVerticalScrollIndicator={false}>

          {activeTab === 'tax' && (
            <View style={styles.cardContainer}>
              {/* Row 1: GST Toggle */}
              <View style={styles.twoColumnRow}>
                <View style={styles.leftCol}>
                  <Text style={styles.colTitle}>GST Calculation</Text>
                  <Text style={styles.colDesc}>
                    Enable or disable tax calculation on retail and wholesale invoices
                  </Text>
                </View>
                <View style={styles.rightCol}>
                  <View style={styles.switchRow}>
                    <Switch
                      value={formData.enableTax}
                      onValueChange={val => handleChange('enableTax', val)}
                    />
                    <View style={{flex: 1, marginLeft: 10}}>
                      <Text style={styles.switchTitle}>
                        {formData.enableTax ? 'GST Enabled' : 'GST Exempt (0%)'}
                      </Text>
                      <Text style={styles.switchDesc}>
                        {formData.enableTax
                          ? 'CGST and SGST will be added to taxable amounts'
                          : 'Orders will be created with zero tax'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Row 2: Tax Presets */}
              <View style={styles.twoColumnRow}>
                <View style={styles.leftCol}>
                  <Text style={styles.colTitle}>Standard Presets</Text>
                  <Text style={styles.colDesc}>
                    Quickly apply standard Indian commodity tax slabs
                  </Text>
                </View>
                <View style={styles.rightCol}>
                  <View style={styles.radioCardsGrid}>
                    {/* Preset 1: 0% */}
                    <Pressable
                      style={[
                        styles.radioCard,
                        formData.cgstPercent === 0 &&
                          formData.sgstPercent === 0 &&
                          styles.radioCardSelected,
                      ]}
                      onPress={() => handleApplyPreset(0, 0)}>
                      <View style={styles.radioCardTop}>
                        <Text style={styles.radioCardTitle}>0% Exempt</Text>
                        {formData.cgstPercent === 0 && formData.sgstPercent === 0 && (
                          <AppIcon name="check" size={13} color="#1F6B4F" />
                        )}
                      </View>
                      <Text style={styles.radioCardSub}>Unbranded Raw Grain</Text>
                    </Pressable>

                    {/* Preset 2: 5% */}
                    <Pressable
                      style={[
                        styles.radioCard,
                        formData.cgstPercent === 2.5 &&
                          formData.sgstPercent === 2.5 &&
                          styles.radioCardSelected,
                      ]}
                      onPress={() => handleApplyPreset(2.5, 2.5)}>
                      <View style={styles.radioCardTop}>
                        <Text style={styles.radioCardTitle}>5% Standard</Text>
                        {formData.cgstPercent === 2.5 && formData.sgstPercent === 2.5 && (
                          <AppIcon name="check" size={13} color="#1F6B4F" />
                        )}
                      </View>
                      <Text style={styles.radioCardSub}>2.5% CGST + 2.5% SGST</Text>
                    </Pressable>

                    {/* Preset 3: 12% */}
                    <Pressable
                      style={[
                        styles.radioCard,
                        formData.cgstPercent === 6 &&
                          formData.sgstPercent === 6 &&
                          styles.radioCardSelected,
                      ]}
                      onPress={() => handleApplyPreset(6, 6)}>
                      <View style={styles.radioCardTop}>
                        <Text style={styles.radioCardTitle}>12% Processed</Text>
                        {formData.cgstPercent === 6 && formData.sgstPercent === 6 && (
                          <AppIcon name="check" size={13} color="#1F6B4F" />
                        )}
                      </View>
                      <Text style={styles.radioCardSub}>6.0% CGST + 6.0% SGST</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Row 3: CGST & SGST percentage fields */}
              <View style={styles.twoColumnRow}>
                <View style={styles.leftCol}>
                  <Text style={styles.colTitle}>CGST & SGST Rates</Text>
                  <Text style={styles.colDesc}>
                    Custom rates applied per item or invoice subtotal
                  </Text>
                  <View style={styles.effectiveGstChip}>
                    <Text style={styles.effectiveGstText}>
                      Effective GST: {effectiveGst}%
                    </Text>
                  </View>
                </View>
                <View style={styles.rightCol}>
                  <View style={styles.fieldGrid}>
                    <View style={styles.fieldItem}>
                      <Text style={styles.fieldLabel}>CGST Rate (%)</Text>
                      <View style={styles.inputWrap}>
                        <TextInput
                          style={styles.textInput}
                          keyboardType="numeric"
                          value={String(formData.cgstPercent ?? '')}
                          onChangeText={txt => {
                            const clean = txt.replace(/[^0-9.]/g, '');
                            handleChange('cgstPercent', clean === '' ? 0 : parseFloat(clean) || 0);
                          }}
                        />
                        <Text style={styles.suffixText}>%</Text>
                      </View>
                      <Text style={styles.helperText}>Central Goods & Services Tax</Text>
                    </View>

                    <View style={styles.fieldItem}>
                      <Text style={styles.fieldLabel}>SGST Rate (%)</Text>
                      <View style={styles.inputWrap}>
                        <TextInput
                          style={styles.textInput}
                          keyboardType="numeric"
                          value={String(formData.sgstPercent ?? '')}
                          onChangeText={txt => {
                            const clean = txt.replace(/[^0-9.]/g, '');
                            handleChange('sgstPercent', clean === '' ? 0 : parseFloat(clean) || 0);
                          }}
                        />
                        <Text style={styles.suffixText}>%</Text>
                      </View>
                      <Text style={styles.helperText}>State Goods & Services Tax</Text>
                    </View>
                  </View>

                  <View style={[styles.fieldItem, {marginTop: 12}]}>
                    <Text style={styles.fieldLabel}>Rice Commodity HSN Code</Text>
                    <View style={styles.inputWrap}>
                      <TextInput
                        style={styles.textInput}
                        value={formData.hsnCode}
                        onChangeText={txt => handleChange('hsnCode', txt)}
                        placeholder="1006"
                      />
                    </View>
                    <Text style={styles.helperText}>HSN Chapter 10 (Cereals / Rice): 1006</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'profile' && (
            <View style={styles.cardContainer}>
              <View style={styles.twoColumnRow}>
                <View style={styles.leftCol}>
                  <Text style={styles.colTitle}>Enterprise Identity</Text>
                  <Text style={styles.colDesc}>
                    Printed on official invoices and customer receipts
                  </Text>
                </View>
                <View style={styles.rightCol}>
                  <View style={styles.fieldItem}>
                    <Text style={styles.fieldLabel}>Trading / Mill Name</Text>
                    <View style={styles.inputWrap}>
                      <TextInput
                        style={styles.textInput}
                        value={formData.companyName}
                        onChangeText={txt => handleChange('companyName', txt)}
                      />
                    </View>
                  </View>

                  <View style={[styles.fieldItem, {marginTop: 10}]}>
                    <Text style={styles.fieldLabel}>Business Tagline / Subtitle</Text>
                    <View style={styles.inputWrap}>
                      <TextInput
                        style={styles.textInput}
                        value={formData.tagline}
                        onChangeText={txt => handleChange('tagline', txt)}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.twoColumnRow}>
                <View style={styles.leftCol}>
                  <Text style={styles.colTitle}>Tax & Contact</Text>
                  <Text style={styles.colDesc}>
                    GSTIN registration and operational contact numbers
                  </Text>
                </View>
                <View style={styles.rightCol}>
                  <View style={styles.fieldGrid}>
                    <View style={styles.fieldItem}>
                      <Text style={styles.fieldLabel}>GSTIN Registration No.</Text>
                      <View style={styles.inputWrap}>
                        <TextInput
                          style={styles.textInput}
                          value={formData.gstin}
                          autoCapitalize="characters"
                          onChangeText={txt => handleChange('gstin', txt.toUpperCase())}
                        />
                      </View>
                    </View>

                    <View style={styles.fieldItem}>
                      <Text style={styles.fieldLabel}>Counter Contact Phone</Text>
                      <View style={styles.inputWrap}>
                        <TextInput
                          style={styles.textInput}
                          value={formData.phone}
                          onChangeText={txt => handleChange('phone', txt)}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={[styles.fieldItem, {marginTop: 10}]}>
                    <Text style={styles.fieldLabel}>Mill / Counter Physical Address</Text>
                    <View style={[styles.inputWrap, {height: 58}]}>
                      <TextInput
                        style={[styles.textInput, {textAlignVertical: 'top', paddingTop: 6}]}
                        multiline
                        numberOfLines={2}
                        value={formData.address}
                        onChangeText={txt => handleChange('address', txt)}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'invoicing' && (
            <View style={styles.cardContainer}>
              <View style={styles.twoColumnRow}>
                <View style={styles.leftCol}>
                  <Text style={styles.colTitle}>POS Calculations</Text>
                  <Text style={styles.colDesc}>
                    Auto-rounding and transaction behaviors
                  </Text>
                </View>
                <View style={styles.rightCol}>
                  <View style={styles.switchRow}>
                    <Switch
                      value={formData.enableRoundOff}
                      onValueChange={val => handleChange('enableRoundOff', val)}
                    />
                    <View style={{flex: 1, marginLeft: 10}}>
                      <Text style={styles.switchTitle}>
                        {formData.enableRoundOff ? 'Round-off to Nearest ₹1 Enabled' : 'Exact Decimals'}
                      </Text>
                      <Text style={styles.switchDesc}>
                        Rounds net invoice payable to whole rupees (e.g. ₹750.50 → ₹751.00)
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.twoColumnRow}>
                <View style={styles.leftCol}>
                  <Text style={styles.colTitle}>Invoice Footer</Text>
                  <Text style={styles.colDesc}>
                    Disclaimers and legal terms printed at bottom of customer receipt
                  </Text>
                </View>
                <View style={styles.rightCol}>
                  <View style={[styles.inputWrap, {height: 64}]}>
                    <TextInput
                      style={[styles.textInput, {textAlignVertical: 'top', paddingTop: 6}]}
                      multiline
                      numberOfLines={2}
                      value={formData.invoiceFooterNote}
                      onChangeText={txt => handleChange('invoiceFooterNote', txt)}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Sticky Bottom Action Bar with dirty state indicator */}
      <View style={styles.stickyFooter}>
        <View style={styles.footerStatus}>
          <View
            style={[
              styles.dirtyDot,
              {backgroundColor: isDirty ? '#C27A12' : '#2E7D4F'},
            ]}
          />
          <Text style={styles.footerStatusText}>
            {isDirty ? 'Unsaved changes' : 'All changes saved to database'}
          </Text>
        </View>

        <View style={styles.footerButtons}>
          <Pressable
            style={({pressed}) => [
              styles.discardBtn,
              pressed && styles.btnPressed,
              !isDirty && styles.btnDisabled,
            ]}
            disabled={!isDirty}
            onPress={handleDiscard}>
            <Text style={[styles.discardBtnText, !isDirty && {color: '#8B938E'}]}>
              Discard
            </Text>
          </Pressable>

          <Pressable
            style={({pressed}) => [
              styles.saveBtn,
              pressed && styles.saveBtnPressed,
              (!isDirty || isSaving) && styles.btnDisabled,
            ]}
            disabled={!isDirty || isSaving}
            onPress={handleSave}>
            <Text style={styles.saveBtnText}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Text>
          </Pressable>
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
  settingsLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  secondaryNav: {
    width: 210,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E7E4DD',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 2,
  },
  navSectionHeader: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#8B938E',
    letterSpacing: 0.8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  navTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
  },
  navTabActive: {
    backgroundColor: '#E8F3EE', // Soft green tint
  },
  navTabText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#5E6661',
  },
  navTabTextActive: {
    color: '#1F6B4F',
    fontWeight: '600',
  },
  mainContentArea: {
    flex: 1,
  },
  contentPadding: {
    padding: 20,
    paddingBottom: 40,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7E4DD',
    padding: 20,
    gap: 16,
  },
  twoColumnRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  leftCol: {
    width: 200,
    gap: 4,
  },
  colTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1F2421',
  },
  colDesc: {
    fontSize: 12,
    color: '#8B938E',
    lineHeight: 16,
  },
  rightCol: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2421',
  },
  switchDesc: {
    fontSize: 11.5,
    color: '#8B938E',
    marginTop: 1,
  },
  radioCardsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  radioCard: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#E7E4DD',
    borderRadius: radii.sm,
    padding: 10,
    gap: 4,
  },
  radioCardSelected: {
    backgroundColor: '#E8F3EE',
    borderColor: '#1F6B4F',
    borderWidth: 1.5,
  },
  radioCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioCardTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1F2421',
  },
  radioCardSub: {
    fontSize: 11,
    color: '#5E6661',
  },
  effectiveGstChip: {
    backgroundColor: '#E8F3EE',
    borderWidth: 1,
    borderColor: '#C5E2D6',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  effectiveGstText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F6B4F',
  },
  fieldGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldItem: {
    flex: 1,
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5E6661',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E4DD',
    borderRadius: radii.sm,
    height: 38,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#1F2421',
    paddingVertical: 0,
  },
  suffixText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#8B938E',
    marginLeft: 4,
  },
  helperText: {
    fontSize: 11,
    color: '#8B938E',
  },
  divider: {
    height: 1,
    backgroundColor: '#E7E4DD',
  },
  stickyFooter: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E7E4DD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  footerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dirtyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  footerStatusText: {
    fontSize: 12,
    color: '#5E6661',
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discardBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.sm,
    backgroundColor: 'transparent',
  },
  discardBtnText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#5E6661',
  },
  saveBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radii.sm,
    backgroundColor: '#1F6B4F',
  },
  saveBtnPressed: {
    backgroundColor: '#185A42',
  },
  saveBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnPressed: {
    opacity: 0.8,
  },
});

export default SettingsScreen;
