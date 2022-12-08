import {
  StyleSheet,
  Image,
  View,
  Pressable,
  Text,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState} from 'react';
import ImageIcon, {ImageIconProps} from './ImageIcon';
import ThemeConfig from '../theme';
import {isWebInternal} from '../utils/common';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';

interface iconProps extends ImageIconProps {
  activeTintColor: string;
}

interface InfoBubbleProps {
  text: string;
  iconProps: iconProps;
  bubbleIconProps?: iconProps;
  hoverMode?: boolean;
  onPress?: () => void;
}

const InfoBubble = (props: InfoBubbleProps) => {
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const [left, setLeft] = useState(0);
  const [position, setPosition] = useState({});
  const [arrowPosition, setArrowPosition] = useState({});
  const {hoverMode = true} = props;
  const tooltipRef = useRef(null);
  const iconRef = useRef(null);
  const pressableRef = useRef(null);
  const {width, height} = Dimensions.get('window');
  const isSmall = width < 700;

  const setModalPosition = (width: number) => {
    setTimeout(() => {
      pressableRef?.current?.measure(
        (
          _fx: number,
          _fy: number,
          _localWidth: number,
          _localHeight: number,
          px: number,
          py: number,
        ) => {
          setPosition({
            top: py - (hoverMode ? 80 : 70),
            left: hoverMode ? 40 : px - (width ? width / 1.5 : 0),
            //left: px - (width ? width / 2 : 0), //TODO: need to dynamically adjust
          });
          setArrowPosition({
            top: py - 6,
            left: 100,
          });
        },
      );
    });
  };

  return hoverMode && isWebInternal() && !isSmall ? (
    <div
      style={{
        position: 'relative',
        marginTop: -3,
        marginLeft: -3,
        background: toolTipVisible
          ? $config.CARD_LAYER_5_COLOR + hexadecimalTransparency['20%']
          : 'transparent',
        width: 28,
        height: 28,
        borderRadius: '50%',
        cursor: toolTipVisible ? 'pointer' : 'auto',
      }}
      onMouseEnter={() => {
        setToolTipVisible(true);
      }}
      onMouseLeave={() => {
        setToolTipVisible(false);
      }}
      ref={iconRef}>
      {toolTipVisible ? (
        <>
          <View
            style={[
              styles.textContainer,
              {left: left - 20},
              {opacity: !left ? 0 : 1},
            ]}
            onLayout={({
              nativeEvent: {
                layout: {x, y, width, height},
              },
            }) => {
              //To center align the tooltip above the icons
              if (!left) setLeft(-(width / 2));
            }}
            ref={tooltipRef}>
            <Text style={[styles.textStyle, {padding: 24}]} numberOfLines={1}>
              {props.text}
            </Text>
          </View>
          <View style={styles.downsideTriangleIconContainer}>
            <ImageIcon
              customSize={{
                width: styles.downsideTriangleIcon.width,
                height: styles.downsideTriangleIcon.height,
              }}
              name={'downside-triangle'}
              tintColor={$config.CARD_LAYER_3_COLOR}
            />
          </View>
        </>
      ) : (
        <></>
      )}
      <View style={styles.iconStyleView}>
        <ImageIcon
          iconSize={props.iconProps.iconSize}
          name={props.iconProps.name}
          tintColor={
            toolTipVisible
              ? props?.iconProps.activeTintColor || props?.iconProps.tintColor
              : props?.iconProps.tintColor
          }
        />
      </View>
    </div>
  ) : (
    <>
      <Modal
        animationType="none"
        transparent={true}
        visible={toolTipVisible}
        onRequestClose={() => {
          setToolTipVisible(!toolTipVisible);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setToolTipVisible(false);
          }}>
          <View style={styles.backDrop} />
        </TouchableWithoutFeedback>

        <View
          style={[styles.textContainer, position, {maxWidth: width - 100}]}
          onLayout={({
            nativeEvent: {
              layout: {x, y, width, height},
            },
          }) => {
            //To center align the tooltip above the icons
            setModalPosition(width);
          }}
          ref={tooltipRef}>
          {props?.bubbleIconProps ? (
            <View
              style={{paddingLeft: 12, marginRight: -4, alignSelf: 'center'}}>
              <ImageIcon {...props.bubbleIconProps} />
            </View>
          ) : (
            <></>
          )}
          <Text style={[styles.textStyle, {padding: 12}]}>{props.text}</Text>
        </View>
      </Modal>
      <View>
        <Pressable
          hitSlop={5}
          ref={pressableRef}
          //style={[styles.iconStyleView]}
          onPress={() => {
            setToolTipVisible(true);
            props?.onPress && props.onPress();
          }}>
          <>
            {toolTipVisible ? (
              <View style={[styles.downsideTriangleIconContainer1]}>
                <ImageIcon
                  customSize={{
                    width: styles.downsideTriangleIcon.width,
                    height: styles.downsideTriangleIcon.height,
                  }}
                  name={'downside-triangle'}
                  tintColor={$config.CARD_LAYER_3_COLOR}
                />
              </View>
            ) : (
              <></>
            )}
            <ImageIcon
              iconSize={props.iconProps.iconSize}
              name={props.iconProps.name}
              tintColor={
                toolTipVisible
                  ? props?.iconProps.activeTintColor ||
                    props?.iconProps.tintColor
                  : props?.iconProps.tintColor
              }
            />
          </>
        </Pressable>
      </View>
    </>
  );
};

export default InfoBubble;

const styles = StyleSheet.create({
  iconStyleView: {
    marginTop: 4,
    marginLeft: 4,
  },
  downsideTriangleIconContainer: {
    position: 'absolute',
    top: -24,
    left: -2,
    zIndex: 999,
  },
  downsideTriangleIconContainer1: {
    position: 'absolute',
    top: -30,
    left: -2,
    zIndex: 999,
  },
  downsideTriangleIcon: {
    width: 27,
    height: 36,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 998,
    backgroundColor: $config.CARD_LAYER_3_COLOR,
    top: -87,
    borderRadius: 12,
    shadowColor:
      $config.HARD_CODED_BLACK_COLOR + hexadecimalTransparency['10%'],
    shadowOffset: {
      height: 4,
      width: 0,
    },
    shadowOpacity: 0.2,
    elevation: 5,
    shadowRadius: 2,
  },
  textStyle: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.normal,
    lineHeight: 24,
    textAlign: 'left',
    color: $config.FONT_COLOR,
  },
  backDrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});
