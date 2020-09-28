interface ConfigInterface {
  projectName: string;
  displayName: string;
  logo: string;
  AppID: string;
  primaryColor: string;
  frontEndURL: string;
  backEndURL: string;
  pstn: boolean;
  precall: boolean;
  watermark: boolean;
  chat: boolean;
  cloudRecording: boolean;
  screenSharing: boolean;
  platformIos: boolean;
  platformAndroid: boolean;
  platformWeb: boolean;
  platformWindows: boolean;
  platformMac: boolean;
  platformLinux: boolean;
  CLIENT_ID: string;
  landingHeading: string;
  landingSubHeading: string;
  illustration: string;
  bg: string;
}
declare var $config: ConfigInterface;
