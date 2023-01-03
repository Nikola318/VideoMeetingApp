import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {SetStateAction} from 'react';
import ThemeConfig from '../theme';
import Spacer from '../atoms/Spacer';

export interface ActionMenuProps {
  actionMenuVisible: boolean;
  setActionMenuVisible: React.Dispatch<SetStateAction<boolean>>;
  modalPosition?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
  name: string;
  onMutePress: () => void;
  type: 'video' | 'audio';
}

const RemoteMutePopup = (props: ActionMenuProps) => {
  const {actionMenuVisible, setActionMenuVisible, modalPosition} = props;
  let message = `Mute ${props.name}'s ${props.type} for everyone on the call? Only ${props.name} can unmute themselves.`;
  return (
    <View>
      <Modal
        testID="action-menu"
        animationType="fade"
        transparent={true}
        visible={actionMenuVisible}>
        <TouchableWithoutFeedback
          onPress={() => {
            setActionMenuVisible(false);
          }}>
          <View style={styles.backDrop} />
        </TouchableWithoutFeedback>
        <View style={[styles.modalView, modalPosition]}>
          <View style={styles.container}>
            <Text style={styles.messageStyle}>{message}</Text>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={() => props.setActionMenuVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <Spacer size={32} horizontal={true} />
              <TouchableOpacity onPress={() => props.onMutePress()}>
                <Text style={styles.btnText}>Mute</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RemoteMutePopup;

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  messageStyle: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.normal,
    color: $config.FONT_COLOR,
    paddingBottom: 24,
  },
  btnText: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.normal,
    color: $config.PRIMARY_ACTION_BRAND_COLOR,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalView: {
    position: 'absolute',
    width: 290,
    backgroundColor: $config.CARD_LAYER_4_COLOR,
    borderRadius: 4,
    shadowColor: $config.HARD_CODED_BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 1,
    elevation: 1,
  },
  backDrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
