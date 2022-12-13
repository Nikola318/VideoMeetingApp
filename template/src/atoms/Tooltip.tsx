import ReactTooltip from 'react-tooltip';
import React, {useState} from 'react';
import {Text, View, ViewStyle} from 'react-native';

interface TooltipProps {
  activeBgStyle?: ViewStyle;
  defaultBgStyle?: ViewStyle;
  renderContent: (
    isToolTipVisible: boolean,
    setToolTipVisible: React.Dispatch<React.SetStateAction<boolean>>,
  ) => React.ReactNode;
  toolTipMessage: string;
  toolTipIcon?: React.ReactNode;
  isClickable?: boolean;
  onPress?: () => void;
}
const Tooltip = (props: TooltipProps) => {
  const [isToolTipVisible, setToolTipVisible] = useState(false);
  const {isClickable = false} = props;
  const css = `
  .custom-tool-tip{
    padding:24px;
    border-radius: 8px;  
  }
  .custom-tool-tip div{
    font-family: "Source Sans Pro";
    font-weight: 400;
    font-size: 16px;
  }
  .__react_component_tooltip.show{
    opacity:1;
  }
  .custom-tool-tip::after {
    width: 20px !important;
    height: 20px !important;
    border-top-right-radius: 5px !important;
    bottom: -10px !important;
    margin-left: -10px !important;    
  }`;
  const randomString = (
    length = 5,
    chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ) => {
    var result = '';
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  };

  const toolTipId = randomString();

  return (
    <>
      <div
        style={{cursor: isClickable ? 'pointer' : 'auto'}}
        data-tip
        data-event={isClickable ? 'click focus' : 'mouseenter'}
        data-event-off={isClickable ? 'focusout' : 'mouseleave'}
        data-for={toolTipId}
        onMouseEnter={() => setToolTipVisible(true)}
        onMouseLeave={() => {
          setToolTipVisible(false);
        }}>
        <View
          style={
            isToolTipVisible ? props?.activeBgStyle : props?.defaultBgStyle
          }>
          {props.renderContent(isToolTipVisible, setToolTipVisible)}
        </View>
      </div>
      <ReactTooltip
        afterShow={() => {
          isClickable && props?.onPress && props.onPress();
        }}
        globalEventOff="click"
        id={toolTipId}
        backgroundColor={$config.CARD_LAYER_3_COLOR}
        textColor={$config.FONT_COLOR}
        className="custom-tool-tip"
        place="top"
        type="dark"
        effect="solid">
        <style type="text/css">{css}</style>
        <View style={{flex: 1, flexDirection: 'row'}}>
          {props?.toolTipIcon ? props.toolTipIcon : null}
          <Text>{props.toolTipMessage}</Text>
        </View>
      </ReactTooltip>
    </>
  );
};
export default Tooltip;
