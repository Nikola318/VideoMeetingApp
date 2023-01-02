import React, {SetStateAction, useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Spacer from '../atoms/Spacer';
import Popup from '../atoms/Popup';
import TertiaryButton from '../atoms/TertiaryButton';
import PrimaryButton from '../atoms/PrimaryButton';
import ThemeConfig from '../theme';
import DimensionContext from '../components/dimension/DimensionContext';

interface RecordingPopupProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<SetStateAction<boolean>>;
  stopRecording: () => void;
}
const RecordingPopup = (props: RecordingPopupProps) => {
  const {getDimensionData} = useContext(DimensionContext);
  const {isDesktop} = getDimensionData();
  const recordingLabelHeading = 'Stop Recording?';
  const recordingLabelSubHeading =
    'Are you sure you want to stop recording? You can’t undo this action.';

  const cancelBtnLabel = 'CANCEL';
  const stopRecordingBtnLabel = 'END RECORDING';
  return (
    <Popup
      modalVisible={props.modalVisible}
      setModalVisible={props.setModalVisible}
      showCloseIcon={false}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>{recordingLabelHeading}</Text>
      <Spacer size={8} />
      <Text style={styles.subHeading}>{recordingLabelSubHeading}</Text>
      <Spacer size={32} />
      <View style={isDesktop ? styles.btnContainer : styles.btnContainerMobile}>
        <View style={{flex: 1}}>
          <TertiaryButton
            containerStyle={{
              minWidth: 'auto',
              width: isDesktop ? 90 : '100%',
              height: 48,
              paddingVertical: 12,
              paddingHorizontal: 12,
              borderRadius: 8,
            }}
            textStyle={styles.btnText}
            text={cancelBtnLabel}
            onPress={() => props.setModalVisible(false)}
          />
        </View>
        {isDesktop ? <Spacer size={10} horizontal={true} /> : <></>}
        <View style={{flex: 2}}>
          <PrimaryButton
            containerStyle={{
              minWidth: 'auto',
              width: '100%',
              borderRadius: 8,
              height: 48,
              backgroundColor: $config.SEMANTIC_ERROR,
              paddingVertical: 12,
              paddingHorizontal: 12,
              marginBottom: isDesktop ? 0 : 20,
            }}
            textStyle={styles.btnText}
            text={stopRecordingBtnLabel}
            onPress={props.stopRecording}
          />
        </View>
      </View>
    </Popup>
  );
};

export default RecordingPopup;

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
  },

  btnContainerMobile: {
    flexDirection: 'column-reverse',
  },
  contentContainer: {
    padding: 24,
    maxWidth: 342,
  },
  heading: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: 22,
    color: $config.SEMANTIC_ERROR,
  },
  subHeading: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.small,
    color: $config.FONT_COLOR,
  },
});
