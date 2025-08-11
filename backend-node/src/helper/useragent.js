import { UAParser } from 'ua-parser-js';

export function userAgent(userAgentString = '') {
  const { os = {}, browser = {}, device = {} } = new UAParser(userAgentString).getResult();

  return {
    os: [os.name, os.version].filter(Boolean).join(' ') || 'Unknown OS',
    browser: [browser.name, browser.version].filter(Boolean).join(' ') || 'Unknown Browser',
    device: device.type || 'Desktop',
    model: device.model || 'Unknown',
    vendor: device.vendor || 'Unknown',
  };
}
