/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import SelectDevice from '../subComponents/SelectDevice';
import LanguageSelector from '../subComponents/LanguageSelector';
import {isWebInternal} from '../utils/common';
import {useSidePanel} from '../utils/useSidePanel';
import {SidePanelType} from '../subComponents/SidePanelEnum';
import ThemeConfig from '../theme';
import SidePanelHeader, {
  SidePanelStyles,
} from '../subComponents/SidePanelHeader';
import useGetName from '../utils/useGetName';
import useSetName from '../utils/useSetName';
import ImageIcon from '../atoms/ImageIcon';
import Spacer from '../atoms/Spacer';
import CommonStyles from './CommonStyles';

interface EditNameProps {}
const EditName: React.FC = (props?: EditNameProps) => {
  const [newName, setNewName] = useState('');
  const [editable, setEditable] = useState(false);
  const username = useGetName();
  const setUsername = useSetName();
  const disabled = !newName || newName.length === 0 || newName === username;
  const inputRef = useRef(null);
  const onPress = () => {
    if (editable) {
      setUsername(newName);
      setEditable(false);
    } else {
      inputRef.current.focus();
      setEditable(true);
    }
  };

  return (
    <>
      <Text style={editNameStyle.yournameText}>Your name</Text>
      <Spacer size={12} />
      <View style={editNameStyle.container}>
        <ImageIcon
          name="person"
          iconSize={20}
          iconType="plain"
          tintColor={$config.SEMANTIC_NETRUAL}
        />
        <TextInput
          ref={inputRef}
          style={[
            editNameStyle.inputStyle,
            !editable
              ? {color: $config.FONT_COLOR + ThemeConfig.EmphasisPlus.disabled}
              : {},
          ]}
          placeholder={username}
          value={newName}
          editable={editable}
          onChangeText={(text) => setNewName(text)}
          onSubmitEditing={() => {
            setUsername(newName);
            setEditable(false);
          }}
          placeholderTextColor={
            $config.FONT_COLOR + ThemeConfig.EmphasisPlus.disabled
          }
        />
        <TouchableOpacity
          disabled={editable ? disabled : false}
          style={[
            editNameStyle.editBtn,
            editable
              ? disabled
                ? {opacity: ThemeConfig.EmphasisOpacity.disabled}
                : {}
              : {},
          ]}
          onPress={onPress}>
          <Text style={editNameStyle.editBtnText}>
            {editable ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const editNameStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: $config.INPUT_FIELD_BORDER_COLOR,
    backgroundColor: $config.INPUT_FIELD_BACKGROUND_COLOR,
    borderRadius: 8,
    paddingLeft: 12,
  },
  editBtn: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderLeftWidth: 1,
    borderLeftColor: $config.INPUT_FIELD_BORDER_COLOR,
  },
  inputStyle: {
    color: $config.FONT_COLOR,
    fontWeight: '600',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontSize: ThemeConfig.FontSize.medium,
    width: '100%',
    paddingHorizontal: 8,
    borderWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  editBtnText: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontSize: ThemeConfig.FontSize.normal,
    fontWeight: '600',
    color: $config.SECONDARY_ACTION_COLOR,
  },
  yournameText: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.small,
    color: $config.FONT_COLOR,
  },
});
const SettingsView = (props) => {
  const [dim, setDim] = useState([
    Dimensions.get('window').width,
    Dimensions.get('window').height,
    Dimensions.get('window').width > Dimensions.get('window').height,
  ]);
  const isSmall = dim[0] < 700;
  const settingsLabel = 'Settings';
  const {setSidePanel} = useSidePanel();

  return (
    <View
      style={
        isWebInternal()
          ? isSmall
            ? CommonStyles.sidePanelContainerNative
            : CommonStyles.sidePanelContainerWeb
          : CommonStyles.sidePanelContainerNative
      }>
      <SidePanelHeader
        centerComponent={
          <Text style={SidePanelStyles.heading}>{settingsLabel}</Text>
        }
        trailingIconName="close-rounded"
        trailingIconOnPress={() => {
          if (!isSmall) {
            setSidePanel(SidePanelType.None);
          } else {
            props.handleClose && props.handleClose();
          }
        }}
      />
      <ScrollView style={style.contentContainer}>
        <EditName />
        <Spacer size={24} />
        <SelectDevice isIconDropdown />
        <LanguageSelector />
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  contentContainer: {
    padding: 20,
  },
});

export default SettingsView;
