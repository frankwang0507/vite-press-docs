import { DefaultTheme } from 'vitepress';
import { BASE_URL_network } from '../base_url';

const sidebar_network: DefaultTheme.SidebarItem[] = [
  { text: 'DNS解析的过程', link: `${BASE_URL_network}/DNS解析的过程` },
  { text: 'DOM解析的过程', link: `${BASE_URL_network}/DOM解析的过程` }
];

export default sidebar_network;