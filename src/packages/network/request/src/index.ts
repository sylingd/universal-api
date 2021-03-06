import { isMiniApp, isWeChatMiniProgram, isWeb, isByteDanceMicroApp } from '@uni/env';
import {
  RequestOptions,
} from './types';
import webModule from './web/index';
import aliMiniAppModule from './ali-miniapp/index';
import weChatModule from './wechat-miniprogram/index';
import bytedanceModule from './bytedance-microapp/index';

export default (options: RequestOptions) => {
  if (isWeChatMiniProgram) {
    return weChatModule(options);
  } else if (isByteDanceMicroApp) {
    return bytedanceModule(options);
  } else if (isMiniApp) {
    return aliMiniAppModule(options);
  } else if (isWeb) {
    return webModule(options);
  } else {
    throw new Error('@uni/apis：request暂不支持');
  }
};

