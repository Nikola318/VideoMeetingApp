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
import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {PropsContext, ClientRole} from '../../agora-rn-uikit';
import CopyJoinInfo from '../subComponents/CopyJoinInfo';
import ParticipantSectionTitle from './participants/ParticipantSectionTitle';
import AllHostParticipants from './participants/AllHostParticipants';
import AllAudienceParticipants from './participants/AllAudienceParticipants';
import CurrentLiveStreamRequestsView from '../subComponents/livestream/CurrentLiveStreamRequestsView';
import {useString} from '../utils/useString';
import {isWebInternal} from '../utils/common';
import {useMeetingInfo} from './meeting-info/useMeetingInfo';
import {useLiveStreamDataContext} from './contexts/LiveStreamDataContext';
import {numFormatter} from '../utils';
import ChatContext from './ChatContext';
import {useSidePanel} from '../utils/useSidePanel';
import {SidePanelType} from '../subComponents/SidePanelEnum';
import TertiaryButton from '../atoms/TertiaryButton';
import HostControlView from './HostControlView';
import {ButtonTemplateName} from '../utils/useButtonTemplate';
import Spacer from '../atoms/Spacer';
import IconButton from '../atoms/IconButton';
import ThemeConfig from '../theme';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import CommonStyles from './CommonStyles';
import SidePanelHeader, {
  SidePanelStyles,
} from '../subComponents/SidePanelHeader';

const ParticipantView = (props) => {
  const {liveStreamData, audienceUids, hostUids} = useLiveStreamDataContext();
  const {onlineUsersCount} = useContext(ChatContext);
  const {sidePanel, setSidePanel} = useSidePanel();
  const {rtcProps} = useContext(PropsContext);
  //commented for v1 release
  // const hostLabel = useString('hostLabel')();
  // const audienceLabel = useString('audienceLabel')();
  // const participantsLabel = useString('participantsLabel')();
  const hostLabel = 'Host';
  const audienceLabel = 'Audience';
  const participantsLabel = `Participants (${numFormatter(onlineUsersCount)})`;
  const {
    data: {isHost},
  } = useMeetingInfo();
  const [dim, setDim] = useState([
    Dimensions.get('window').width,
    Dimensions.get('window').height,
    Dimensions.get('window').width > Dimensions.get('window').height,
  ]);
  const isSmall = dim[0] < 700;
  const [showHostSection, setShowHostSection] = useState(true);
  const [showParticipantSection, setShowParticipantSection] = useState(true);

  return (
    <View
      testID="videocall-participants"
      style={
        isWebInternal()
          ? isSmall
            ? CommonStyles.sidePanelContainerNative
            : CommonStyles.sidePanelContainerWeb
          : CommonStyles.sidePanelContainerNative
      }>
      <SidePanelHeader
        centerComponent={
          <Text style={SidePanelStyles.heading}>{participantsLabel}</Text>
        }
        trailingIconName="close-rounded"
        trailingIconOnPress={() => {
          if (!isSmall) {
            setSidePanel(SidePanelType.None);
          } else {
            props?.handleClose();
          }
        }}
      />
      <ScrollView style={[style.bodyContainer]}>
        {$config.EVENT_MODE ? (
          <>
            {
              /*Live streaming is true            
                Host and New host view */
              rtcProps?.role == ClientRole.Broadcaster &&
                (isHost ? (
                  /**
                   * Original Host
                   * a) Can view streaming requests
                   * b) Can view all hosts with remote controls
                   */
                  <>
                    {/* a) Live streaming view */}
                    <CurrentLiveStreamRequestsView userList={liveStreamData} />
                    {/* b) Host view with remote controls*/}
                    <ParticipantSectionTitle
                      title={hostLabel}
                      count={hostUids.length}
                      isOpen={showHostSection}
                      onPress={() => setShowHostSection(!showHostSection)}
                    />
                    {showHostSection ? (
                      <AllHostParticipants
                        isMobile={isSmall}
                        updateActionSheet={props.updateActionSheet}
                        handleClose={props.handleClose}
                      />
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  /** New Host ( earlier was 'audience' and now is host )
                   *  a) Can view all hosts without remote controls
                   */
                  <>
                    <ParticipantSectionTitle
                      title={hostLabel}
                      count={hostUids.length}
                      isOpen={showParticipantSection}
                      onPress={() =>
                        setShowParticipantSection(!showParticipantSection)
                      }
                    />
                    {showParticipantSection ? (
                      <AllAudienceParticipants
                        uids={hostUids}
                        isMobile={isSmall}
                        updateActionSheet={props.updateActionSheet}
                        handleClose={props.handleClose}
                      />
                    ) : (
                      <></>
                    )}
                  </>
                ))
            }
            {
              /**
               *  Audience views all hosts without remote controls
               */
              rtcProps?.role == ClientRole.Audience && (
                <>
                  <ParticipantSectionTitle
                    title={hostLabel}
                    count={hostUids.length}
                    isOpen={showHostSection}
                    onPress={() => setShowHostSection(!showHostSection)}
                  />
                  {showHostSection ? (
                    <AllAudienceParticipants
                      uids={hostUids}
                      isMobile={isSmall}
                      updateActionSheet={props.updateActionSheet}
                      handleClose={props.handleClose}
                    />
                  ) : (
                    <></>
                  )}
                </>
              )
            }
            {
              /* Everyone can see audience */
              <>
                <ParticipantSectionTitle
                  title={audienceLabel}
                  count={audienceUids.length}
                  isOpen={showParticipantSection}
                  onPress={() =>
                    setShowParticipantSection(!showParticipantSection)
                  }
                />
                {showParticipantSection ? (
                  <AllAudienceParticipants
                    uids={audienceUids}
                    isMobile={isSmall}
                    updateActionSheet={props.updateActionSheet}
                    handleClose={props.handleClose}
                  />
                ) : (
                  <></>
                )}
              </>
            }
          </>
        ) : (
          <AllHostParticipants
            isMobile={isSmall}
            updateActionSheet={props.updateActionSheet}
            handleClose={props.handleClose}
          />
        )}
      </ScrollView>

      <View style={style.footer}>
        <CopyJoinInfo showTeritaryButton />
        {isHost && (
          <>
            <Spacer horizontal size={8} />
            <HostControlView />
          </>
        )}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  footer: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: $config.CARD_LAYER_2_COLOR,
  },
  bodyContainer: {
    flex: 1,
  },
});

export default ParticipantView;
