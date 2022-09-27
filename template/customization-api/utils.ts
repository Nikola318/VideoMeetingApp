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
// commented for v1 release
//export {default as useIsScreenShare} from '../src/utils/useIsScreenShare';

//hooks used to check user type
export {default as useIsHost} from '../src/utils/useIsHost';
export {default as useIsAttendee} from '../src/utils/useIsAttendee';
export {default as useIsPSTN} from '../src/utils/useIsPSTN';

//hook to manage audio/video states
export {default as useIsAudioEnabled} from '../src/utils/useIsAudioEnabled';
export {default as useIsVideoEnabled} from '../src/utils/useIsVideoEnabled';

//hooks used for navigation
export {useHistory, useParams} from '../src/components/Router';

//export common function
export {
  useIsWeb,
  useIsIOS,
  useIsAndroid,
  useIsDestop,
  useHasBrandLogo,
} from '../src/utils/common';
export {default as useIsMobileOrTablet} from '../src/utils/useIsMobileOrTablet';
export {useLocalUid} from '../agora-rn-uikit';
