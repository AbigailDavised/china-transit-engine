// Auto-extracted from CheckChinaTransit official NIA dataset (2026.1 (Updated Post-NIA Dec 2025 Order))
export type VisaCategory = 'MUTUAL_VISA_FREE' | 'UNILATERAL_VISA_FREE' | 'TWOV_ONLY';

export interface CountryRule {
  code: string;
  name: string;
  region: string;
  visaCategory: VisaCategory;
  visaFreeDays: number;
}

export interface TransitPort {
  id: string;
  city: string;
  name: string;
  type: 'Airport' | 'Seaport' | 'Railway';
  region: string;
  allowableStayArea: string;
  popular: boolean;
}

export const POLICY_VERSION = "2026.1 (Updated Post-NIA Dec 2025 Order)";
export const EFFECTIVE_DATE = "December 2025";

export const COUNTRIES: readonly CountryRule[] = [
  {
    "code": "AT",
    "name": "Austria",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "BE",
    "name": "Belgium",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "CZ",
    "name": "Czech Republic",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "DK",
    "name": "Denmark",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "EE",
    "name": "Estonia",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "FI",
    "name": "Finland",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "FR",
    "name": "France",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "DE",
    "name": "Germany",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "GR",
    "name": "Greece",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "HU",
    "name": "Hungary",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "IS",
    "name": "Iceland",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "IT",
    "name": "Italy",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "LV",
    "name": "Latvia",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "LT",
    "name": "Lithuania",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "LU",
    "name": "Luxembourg",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "MT",
    "name": "Malta",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "NL",
    "name": "Netherlands",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "NO",
    "name": "Norway",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "PL",
    "name": "Poland",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "PT",
    "name": "Portugal",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "SK",
    "name": "Slovakia",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "SI",
    "name": "Slovenia",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "ES",
    "name": "Spain",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "SE",
    "name": "Sweden",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "CH",
    "name": "Switzerland",
    "region": "European Schengen",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "RU",
    "name": "Russia",
    "region": "Other European",
    "visaCategory": "TWOV_ONLY",
    "visaFreeDays": 10
  },
  {
    "code": "GB",
    "name": "United Kingdom",
    "region": "Other European",
    "visaCategory": "TWOV_ONLY",
    "visaFreeDays": 10
  },
  {
    "code": "IE",
    "name": "Ireland",
    "region": "Other European",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "CY",
    "name": "Cyprus",
    "region": "Other European",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "BG",
    "name": "Bulgaria",
    "region": "Other European",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "RO",
    "name": "Romania",
    "region": "Other European",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "UA",
    "name": "Ukraine",
    "region": "Other European",
    "visaCategory": "TWOV_ONLY",
    "visaFreeDays": 10
  },
  {
    "code": "RS",
    "name": "Serbia",
    "region": "Other European",
    "visaCategory": "MUTUAL_VISA_FREE",
    "visaFreeDays": 30
  },
  {
    "code": "HR",
    "name": "Croatia",
    "region": "Other European",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "BA",
    "name": "Bosnia and Herzegovina",
    "region": "Other European",
    "visaCategory": "MUTUAL_VISA_FREE",
    "visaFreeDays": 30
  },
  {
    "code": "ME",
    "name": "Montenegro",
    "region": "Other European",
    "visaCategory": "TWOV_ONLY",
    "visaFreeDays": 10
  },
  {
    "code": "MK",
    "name": "North Macedonia",
    "region": "Other European",
    "visaCategory": "TWOV_ONLY",
    "visaFreeDays": 10
  },
  {
    "code": "AL",
    "name": "Albania",
    "region": "Other European",
    "visaCategory": "MUTUAL_VISA_FREE",
    "visaFreeDays": 90
  },
  {
    "code": "MC",
    "name": "Monaco",
    "region": "Other European",
    "visaCategory": "TWOV_ONLY",
    "visaFreeDays": 10
  },
  {
    "code": "BY",
    "name": "Belarus",
    "region": "Other European",
    "visaCategory": "MUTUAL_VISA_FREE",
    "visaFreeDays": 30
  },
  {
    "code": "US",
    "name": "United States",
    "region": "Americas",
    "visaCategory": "TWOV_ONLY",
    "visaFreeDays": 10
  },
  {
    "code": "CA",
    "name": "Canada",
    "region": "Americas",
    "visaCategory": "TWOV_ONLY",
    "visaFreeDays": 10
  },
  {
    "code": "BR",
    "name": "Brazil",
    "region": "Americas",
    "visaCategory": "TWOV_ONLY",
    "visaFreeDays": 10
  },
  {
    "code": "MX",
    "name": "Mexico",
    "region": "Americas",
    "visaCategory": "TWOV_ONLY",
    "visaFreeDays": 10
  },
  {
    "code": "AR",
    "name": "Argentina",
    "region": "Americas",
    "visaCategory": "TWOV_ONLY",
    "visaFreeDays": 10
  },
  {
    "code": "CL",
    "name": "Chile",
    "region": "Americas",
    "visaCategory": "TWOV_ONLY",
    "visaFreeDays": 10
  },
  {
    "code": "AU",
    "name": "Australia",
    "region": "Oceania",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "NZ",
    "name": "New Zealand",
    "region": "Oceania",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "KR",
    "name": "South Korea",
    "region": "Asia",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "JP",
    "name": "Japan",
    "region": "Asia",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 15
  },
  {
    "code": "SG",
    "name": "Singapore",
    "region": "Asia",
    "visaCategory": "MUTUAL_VISA_FREE",
    "visaFreeDays": 30
  },
  {
    "code": "MY",
    "name": "Malaysia",
    "region": "Asia",
    "visaCategory": "MUTUAL_VISA_FREE",
    "visaFreeDays": 30
  },
  {
    "code": "TH",
    "name": "Thailand",
    "region": "Asia",
    "visaCategory": "MUTUAL_VISA_FREE",
    "visaFreeDays": 30
  },
  {
    "code": "BN",
    "name": "Brunei",
    "region": "Asia",
    "visaCategory": "UNILATERAL_VISA_FREE",
    "visaFreeDays": 14
  },
  {
    "code": "AE",
    "name": "United Arab Emirates",
    "region": "Asia",
    "visaCategory": "MUTUAL_VISA_FREE",
    "visaFreeDays": 30
  },
  {
    "code": "QA",
    "name": "Qatar",
    "region": "Asia",
    "visaCategory": "MUTUAL_VISA_FREE",
    "visaFreeDays": 30
  }
];

export const PORTS: readonly TransitPort[] = [
  {
    "id": "beijing-capital",
    "city": "Beijing",
    "name": "Beijing Capital International Airport (PEK)",
    "type": "Airport",
    "region": "Beijing-Tianjin-Hebei Region",
    "allowableStayArea": "Beijing Municipality, Tianjin Municipality, and Hebei Province",
    "popular": true
  },
  {
    "id": "beijing-daxing",
    "city": "Beijing",
    "name": "Beijing Daxing International Airport (PKX)",
    "type": "Airport",
    "region": "Beijing-Tianjin-Hebei Region",
    "allowableStayArea": "Beijing Municipality, Tianjin Municipality, and Hebei Province",
    "popular": true
  },
  {
    "id": "tianjin-binhai",
    "city": "Tianjin",
    "name": "Tianjin Binhai International Airport (TSN)",
    "type": "Airport",
    "region": "Beijing-Tianjin-Hebei Region",
    "allowableStayArea": "Beijing Municipality, Tianjin Municipality, and Hebei Province",
    "popular": false
  },
  {
    "id": "tianjin-cruise",
    "city": "Tianjin",
    "name": "Tianjin International Cruise Home Port",
    "type": "Seaport",
    "region": "Beijing-Tianjin-Hebei Region",
    "allowableStayArea": "Beijing Municipality, Tianjin Municipality, and Hebei Province",
    "popular": false
  },
  {
    "id": "shijiazhuang-zhengding",
    "city": "Shijiazhuang",
    "name": "Shijiazhuang Zhengding International Airport (SJW)",
    "type": "Airport",
    "region": "Beijing-Tianjin-Hebei Region",
    "allowableStayArea": "Beijing Municipality, Tianjin Municipality, and Hebei Province",
    "popular": false
  },
  {
    "id": "qinhuangdao-port",
    "city": "Qinhuangdao",
    "name": "Qinhuangdao Port",
    "type": "Seaport",
    "region": "Beijing-Tianjin-Hebei Region",
    "allowableStayArea": "Beijing Municipality, Tianjin Municipality, and Hebei Province",
    "popular": false
  },
  {
    "id": "shanghai-pudong",
    "city": "Shanghai",
    "name": "Shanghai Pudong International Airport (PVG)",
    "type": "Airport",
    "region": "Yangtze River Delta (Shanghai-Jiangsu-Zhejiang-Anhui)",
    "allowableStayArea": "Shanghai Municipality, Jiangsu Province, Zhejiang Province, and Anhui Province",
    "popular": true
  },
  {
    "id": "shanghai-hongqiao",
    "city": "Shanghai",
    "name": "Shanghai Hongqiao International Airport (SHA)",
    "type": "Airport",
    "region": "Yangtze River Delta (Shanghai-Jiangsu-Zhejiang-Anhui)",
    "allowableStayArea": "Shanghai Municipality, Jiangsu Province, Zhejiang Province, and Anhui Province",
    "popular": true
  },
  {
    "id": "shanghai-port",
    "city": "Shanghai",
    "name": "Shanghai Port Passenger Cruise Terminal & Wusongkou",
    "type": "Seaport",
    "region": "Yangtze River Delta (Shanghai-Jiangsu-Zhejiang-Anhui)",
    "allowableStayArea": "Shanghai Municipality, Jiangsu Province, Zhejiang Province, and Anhui Province",
    "popular": false
  },
  {
    "id": "hangzhou-xiaoshan",
    "city": "Hangzhou",
    "name": "Hangzhou Xiaoshan International Airport (HGH)",
    "type": "Airport",
    "region": "Yangtze River Delta (Shanghai-Jiangsu-Zhejiang-Anhui)",
    "allowableStayArea": "Shanghai Municipality, Jiangsu Province, Zhejiang Province, and Anhui Province",
    "popular": true
  },
  {
    "id": "nanjing-lukou",
    "city": "Nanjing",
    "name": "Nanjing Lukou International Airport (NKG)",
    "type": "Airport",
    "region": "Yangtze River Delta (Shanghai-Jiangsu-Zhejiang-Anhui)",
    "allowableStayArea": "Shanghai Municipality, Jiangsu Province, Zhejiang Province, and Anhui Province",
    "popular": false
  },
  {
    "id": "ningbo-lishe",
    "city": "Ningbo",
    "name": "Ningbo Lishe International Airport (NGB)",
    "type": "Airport",
    "region": "Yangtze River Delta (Shanghai-Jiangsu-Zhejiang-Anhui)",
    "allowableStayArea": "Shanghai Municipality, Jiangsu Province, Zhejiang Province, and Anhui Province",
    "popular": false
  },
  {
    "id": "wenzhou-longwan",
    "city": "Wenzhou",
    "name": "Wenzhou Longwan International Airport (WNZ)",
    "type": "Airport",
    "region": "Yangtze River Delta (Shanghai-Jiangsu-Zhejiang-Anhui)",
    "allowableStayArea": "Shanghai Municipality, Jiangsu Province, Zhejiang Province, and Anhui Province",
    "popular": false
  },
  {
    "id": "hefei-xinqiao",
    "city": "Hefei",
    "name": "Hefei Xinqiao International Airport (HFE)",
    "type": "Airport",
    "region": "Yangtze River Delta (Shanghai-Jiangsu-Zhejiang-Anhui)",
    "allowableStayArea": "Shanghai Municipality, Jiangsu Province, Zhejiang Province, and Anhui Province",
    "popular": false
  },
  {
    "id": "huangshan-tunxi",
    "city": "Huangshan",
    "name": "Huangshan Tunxi International Airport (TXN)",
    "type": "Airport",
    "region": "Yangtze River Delta (Shanghai-Jiangsu-Zhejiang-Anhui)",
    "allowableStayArea": "Shanghai Municipality, Jiangsu Province, Zhejiang Province, and Anhui Province",
    "popular": false
  },
  {
    "id": "guangzhou-baiyun",
    "city": "Guangzhou",
    "name": "Guangzhou Baiyun International Airport (CAN)",
    "type": "Airport",
    "region": "Guangdong Province (Greater Bay Area)",
    "allowableStayArea": "Entire Guangdong Province",
    "popular": true
  },
  {
    "id": "shenzhen-baoan",
    "city": "Shenzhen",
    "name": "Shenzhen Bao'an International Airport (SZX)",
    "type": "Airport",
    "region": "Guangdong Province (Greater Bay Area)",
    "allowableStayArea": "Entire Guangdong Province",
    "popular": true
  },
  {
    "id": "shenzhen-shekou",
    "city": "Shenzhen",
    "name": "Shenzhen Shekou Cruise Terminal",
    "type": "Seaport",
    "region": "Guangdong Province (Greater Bay Area)",
    "allowableStayArea": "Entire Guangdong Province",
    "popular": false
  },
  {
    "id": "guangzhou-nansha",
    "city": "Guangzhou",
    "name": "Guangzhou Nansha Port Passenger Terminal",
    "type": "Seaport",
    "region": "Guangdong Province (Greater Bay Area)",
    "allowableStayArea": "Entire Guangdong Province",
    "popular": false
  },
  {
    "id": "jieyang-chaoshan",
    "city": "Jieyang / Shantou",
    "name": "Jieyang Chaoshan International Airport (SWA)",
    "type": "Airport",
    "region": "Guangdong Province (Greater Bay Area)",
    "allowableStayArea": "Entire Guangdong Province",
    "popular": false
  },
  {
    "id": "chengdu-tianfu",
    "city": "Chengdu",
    "name": "Chengdu Tianfu International Airport (TFU)",
    "type": "Airport",
    "region": "Sichuan Province",
    "allowableStayArea": "Chengdu, Deyang, Suining, Meishan, Ziyang, Leshan, Ya'an, Neijiang, Zigong, Luzhou, and Yibin cities",
    "popular": true
  },
  {
    "id": "chengdu-shuangliu",
    "city": "Chengdu",
    "name": "Chengdu Shuangliu International Airport (CTU)",
    "type": "Airport",
    "region": "Sichuan Province",
    "allowableStayArea": "Chengdu, Deyang, Suining, Meishan, Ziyang, Leshan, Ya'an, Neijiang, Zigong, Luzhou, and Yibin cities",
    "popular": false
  },
  {
    "id": "xian-xianyang",
    "city": "Xi'an",
    "name": "Xi'an Xianyang International Airport (XIY)",
    "type": "Airport",
    "region": "Shaanxi Province",
    "allowableStayArea": "Administrative precincts of Xi'an and Xianyang cities",
    "popular": true
  },
  {
    "id": "chongqing-jiangbei",
    "city": "Chongqing",
    "name": "Chongqing Jiangbei International Airport (CKG)",
    "type": "Airport",
    "region": "Chongqing Municipality",
    "allowableStayArea": "Entire Chongqing Municipality",
    "popular": true
  },
  {
    "id": "xiamen-gaoqi",
    "city": "Xiamen",
    "name": "Xiamen Gaoqi International Airport (XMN)",
    "type": "Airport",
    "region": "Fujian Province",
    "allowableStayArea": "Entire Fujian Province",
    "popular": true
  },
  {
    "id": "xiamen-seaport",
    "city": "Xiamen",
    "name": "Xiamen International Cruise Center",
    "type": "Seaport",
    "region": "Fujian Province",
    "allowableStayArea": "Entire Fujian Province",
    "popular": false
  },
  {
    "id": "fuzhou-changle",
    "city": "Fuzhou",
    "name": "Fuzhou Changle International Airport (FOC)",
    "type": "Airport",
    "region": "Fujian Province",
    "allowableStayArea": "Entire Fujian Province",
    "popular": false
  },
  {
    "id": "quanzhou-jinjiang",
    "city": "Quanzhou",
    "name": "Quanzhou Jinjiang International Airport (JJN)",
    "type": "Airport",
    "region": "Fujian Province",
    "allowableStayArea": "Entire Fujian Province",
    "popular": false
  },
  {
    "id": "kunming-changshui",
    "city": "Kunming",
    "name": "Kunming Changshui International Airport (KMG)",
    "type": "Airport",
    "region": "Yunnan Province",
    "allowableStayArea": "Kunming, Lijiang, Yuxi, Pu'er, Chuxiong, Dali, Xishuangbanna, Honghe, Wenshan prefectures/cities",
    "popular": true
  },
  {
    "id": "lijiang-sanyi",
    "city": "Lijiang",
    "name": "Lijiang Sanyi International Airport (LJG)",
    "type": "Airport",
    "region": "Yunnan Province",
    "allowableStayArea": "Designated cities in Yunnan Province",
    "popular": false
  },
  {
    "id": "mohan-railway",
    "city": "Mohan / Xishuangbanna",
    "name": "Mohan Railway Port (China-Laos Railway)",
    "type": "Railway",
    "region": "Yunnan Province",
    "allowableStayArea": "Designated cities in Yunnan Province",
    "popular": false
  },
  {
    "id": "wuhan-tianhe",
    "city": "Wuhan",
    "name": "Wuhan Tianhe International Airport (WUH)",
    "type": "Airport",
    "region": "Hubei Province",
    "allowableStayArea": "Entire Hubei Province",
    "popular": false
  },
  {
    "id": "changsha-huanghua",
    "city": "Changsha",
    "name": "Changsha Huanghua International Airport (CSX)",
    "type": "Airport",
    "region": "Hunan Province",
    "allowableStayArea": "Entire Hunan Province",
    "popular": false
  },
  {
    "id": "zhangjiajie-hehua",
    "city": "Zhangjiajie",
    "name": "Zhangjiajie Hehua International Airport (DYG)",
    "type": "Airport",
    "region": "Hunan Province",
    "allowableStayArea": "Entire Hunan Province",
    "popular": false
  },
  {
    "id": "qingdao-jiaodong",
    "city": "Qingdao",
    "name": "Qingdao Jiaodong International Airport (TAO)",
    "type": "Airport",
    "region": "Shandong Province",
    "allowableStayArea": "Entire Shandong Province",
    "popular": false
  },
  {
    "id": "jinan-yaoqiang",
    "city": "Jinan",
    "name": "Jinan Yaoqiang International Airport (TNA)",
    "type": "Airport",
    "region": "Shandong Province",
    "allowableStayArea": "Entire Shandong Province",
    "popular": false
  },
  {
    "id": "shenyang-taoxian",
    "city": "Shenyang",
    "name": "Shenyang Taoxian International Airport (SHE)",
    "type": "Airport",
    "region": "Liaoning Province",
    "allowableStayArea": "Entire Liaoning Province",
    "popular": false
  },
  {
    "id": "dalian-zhoushuizi",
    "city": "Dalian",
    "name": "Dalian Zhoushuizi International Airport (DLC)",
    "type": "Airport",
    "region": "Liaoning Province",
    "allowableStayArea": "Entire Liaoning Province",
    "popular": false
  },
  {
    "id": "harbin-taiping",
    "city": "Harbin",
    "name": "Harbin Taiping International Airport (HRB)",
    "type": "Airport",
    "region": "Heilongjiang Province",
    "allowableStayArea": "Harbin City administrative area",
    "popular": false
  },
  {
    "id": "guilin-liangjiang",
    "city": "Guilin",
    "name": "Guilin Liangjiang International Airport (KWL)",
    "type": "Airport",
    "region": "Guangxi Zhuang Autonomous Region",
    "allowableStayArea": "Guilin City administrative area",
    "popular": false
  },
  {
    "id": "nanning-wuxu",
    "city": "Nanning",
    "name": "Nanning Wuxu International Airport (NNG)",
    "type": "Airport",
    "region": "Guangxi Zhuang Autonomous Region",
    "allowableStayArea": "Guangxi Region designated cities",
    "popular": false
  },
  {
    "id": "haikou-meilan",
    "city": "Haikou",
    "name": "Haikou Meilan International Airport (HAK)",
    "type": "Airport",
    "region": "Hainan Province",
    "allowableStayArea": "Hainan Province (Note: Hainan also offers separate 30-day visa-free entry for 59 nations)",
    "popular": false
  },
  {
    "id": "sanya-phoenix",
    "city": "Sanya",
    "name": "Sanya Phoenix International Airport (SYX)",
    "type": "Airport",
    "region": "Hainan Province",
    "allowableStayArea": "Hainan Province",
    "popular": false
  },
  {
    "id": "taiyuan-wusu",
    "city": "Taiyuan",
    "name": "Taiyuan Wusu International Airport (TYN)",
    "type": "Airport",
    "region": "Shanxi Province",
    "allowableStayArea": "Shanxi Province",
    "popular": false
  },
  {
    "id": "hohhot-baita",
    "city": "Hohhot",
    "name": "Hohhot Baita International Airport (HET)",
    "type": "Airport",
    "region": "Inner Mongolia Autonomous Region",
    "allowableStayArea": "Hohhot City administrative precinct",
    "popular": false
  },
  {
    "id": "yantai-penglai",
    "city": "Yantai",
    "name": "Yantai Penglai International Airport (YNT)",
    "type": "Airport",
    "region": "Shandong Province",
    "allowableStayArea": "Entire Shandong Province",
    "popular": false
  },
  {
    "id": "weihai-dashuibo",
    "city": "Weihai",
    "name": "Weihai Dashuibo International Airport (WEH)",
    "type": "Airport",
    "region": "Shandong Province",
    "allowableStayArea": "Entire Shandong Province",
    "popular": false
  },
  {
    "id": "huangshan-tunxi",
    "city": "Huangshan",
    "name": "Huangshan Tunxi International Airport (TXN)",
    "type": "Airport",
    "region": "Anhui Province",
    "allowableStayArea": "Anhui Province",
    "popular": false
  },
  {
    "id": "yinchuan-hedong",
    "city": "Yinchuan",
    "name": "Yinchuan Hedong International Airport (INC)",
    "type": "Airport",
    "region": "Ningxia Hui Autonomous Region",
    "allowableStayArea": "Ningxia Hui Autonomous Region",
    "popular": false
  },
  {
    "id": "xining-caojiabao",
    "city": "Xining",
    "name": "Xining Caojiabao International Airport (XNN)",
    "type": "Airport",
    "region": "Qinghai Province",
    "allowableStayArea": "Qinghai Province designated cities",
    "popular": false
  },
  {
    "id": "lanzhou-zhongchuan",
    "city": "Lanzhou",
    "name": "Lanzhou Zhongchuan International Airport (LHW)",
    "type": "Airport",
    "region": "Gansu Province",
    "allowableStayArea": "Lanzhou City administrative precinct",
    "popular": false
  },
  {
    "id": "guiyang-longdongbao",
    "city": "Guiyang",
    "name": "Guiyang Longdongbao International Airport (KWE)",
    "type": "Airport",
    "region": "Guizhou Province",
    "allowableStayArea": "Guizhou Province",
    "popular": false
  },
  {
    "id": "nanchang-changbei",
    "city": "Nanchang",
    "name": "Nanchang Changbei International Airport (KHN)",
    "type": "Airport",
    "region": "Jiangxi Province",
    "allowableStayArea": "Jiangxi Province",
    "popular": false
  },
  {
    "id": "urumuqi-diwopu",
    "city": "Urumqi",
    "name": "Urumqi Diwopu International Airport (URC)",
    "type": "Airport",
    "region": "Xinjiang Uyghur Autonomous Region",
    "allowableStayArea": "Urumqi City administrative precinct",
    "popular": false
  },
  {
    "id": "dalian-port",
    "city": "Dalian",
    "name": "Dalian International Passenger Port",
    "type": "Seaport",
    "region": "Liaoning Province",
    "allowableStayArea": "Entire Liaoning Province",
    "popular": false
  },
  {
    "id": "zhoushan-port",
    "city": "Zhoushan",
    "name": "Zhoushan Putuoshan Passenger Port",
    "type": "Seaport",
    "region": "Zhejiang Province (Yangtze River Delta)",
    "allowableStayArea": "Shanghai, Jiangsu, Zhejiang Provinces",
    "popular": false
  },
  {
    "id": "haikou-port",
    "city": "Haikou",
    "name": "Haikou Xiuying Passenger Port",
    "type": "Seaport",
    "region": "Hainan Province",
    "allowableStayArea": "Hainan Province",
    "popular": false
  },
  {
    "id": "sanya-cruise-port",
    "city": "Sanya",
    "name": "Sanya Phoenix Island International Cruise Port",
    "type": "Seaport",
    "region": "Hainan Province",
    "allowableStayArea": "Hainan Province",
    "popular": false
  },
  {
    "id": "guangzhou-railway",
    "city": "Guangzhou",
    "name": "Guangzhou East Railway Station Port",
    "type": "Railway",
    "region": "Guangdong Province (Greater Bay Area)",
    "allowableStayArea": "Entire Guangdong Province",
    "popular": false
  },
  {
    "id": "shenzhen-luohu",
    "city": "Shenzhen",
    "name": "Shenzhen Luohu Railway Border Port",
    "type": "Railway",
    "region": "Guangdong Province (Greater Bay Area)",
    "allowableStayArea": "Entire Guangdong Province",
    "popular": false
  }
];
