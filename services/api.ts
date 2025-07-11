import { SettingsManager } from "./storage";

export interface DoubanItem {
  title: string;
  poster: string;
  rate?: string;
}

export interface DoubanResponse {
  code: number;
  message: string;
  list: DoubanItem[];
}

export interface VideoDetail {
  code: number;
  episodes: string[];
  detailUrl: string;
  videoInfo: {
    title: string;
    cover?: string;
    desc?: string;
    type?: string;
    year?: string;
    area?: string;
    director?: string;
    actor?: string;
    remarks?: string;
    source_name: string;
    source: string;
    id: string;
  };
}

export interface SearchResult {
  id: number;
  title: string;
  poster: string;
  episodes: string[];
  source: string;
  source_name: string;
  class?: string;
  year: string;
  desc?: string;
  type_name?: string;
}

// Data structure for play records
export interface PlayRecord {
  title: string;
  source_name: string;
  cover: string;
  index: number; // Episode number
  total_episodes: number; // Total number of episodes
  play_time: number; // Play progress in seconds
  total_time: number; // Total duration in seconds
  save_time: number; // Timestamp of when the record was saved
  user_id: number; // User ID, always 0 in this version
}

export interface ApiSite {
  key: string;
  api: string;
  name: string;
  detail?: string;
}

export class API {
  public baseURL: string = "";

  constructor(baseURL?: string) {
    if (baseURL) {
      this.baseURL = baseURL;
    }
  }

  public setBaseUrl(url: string) {
    this.baseURL = url;
  }

  /**
   * 生成图片代理 URL
   */
  getImageProxyUrl(imageUrl: string): string {
    return `${this.baseURL}/api/image-proxy?url=${encodeURIComponent(
      imageUrl
    )}`;
  }

  /**
   * 获取豆瓣数据
   */
  async getDoubanData(
    type: "movie" | "tv",
    tag: string,
    pageSize: number = 16,
    pageStart: number = 0
  ): Promise<DoubanResponse> {
    if (!this.baseURL) {
      throw new Error("API_URL_NOT_SET");
    }
    const url = `${
      this.baseURL
    }/api/douban?type=${type}&tag=${encodeURIComponent(
      tag
    )}&pageSize=${pageSize}&pageStart=${pageStart}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  /**
   * 搜索视频
   */
  async searchVideos(query: string): Promise<{ results: SearchResult[] }> {
    if (!this.baseURL) {
      throw new Error("API_URL_NOT_SET");
    }
    const url = `${this.baseURL}/api/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  async searchVideo(query: string, resourceId: string, signal?: AbortSignal): Promise<{ results: SearchResult[] }> {
    if (!this.baseURL) {
      throw new Error("API_URL_NOT_SET");
    }
    const url = `${this.baseURL}/api/search/one?q=${encodeURIComponent(query)}&resourceId=${encodeURIComponent(resourceId)}`;
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  async getResources(signal?: AbortSignal): Promise<ApiSite[]> {
   if (!this.baseURL) {
      throw new Error("API_URL_NOT_SET");
    }
    const url = `${this.baseURL}/api/search/resources`;
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }


  /**
   * 获取视频详情
   */
  async getVideoDetail(source: string, id: string): Promise<VideoDetail> {
    if (!this.baseURL) {
      throw new Error("API_URL_NOT_SET");
    }
    const url = `${this.baseURL}/api/detail?source=${source}&id=${id}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }
}

// 默认实例
export let api = new API();

// 初始化 API
export const initializeApi = async () => {
  const settings = await SettingsManager.get();
  api.setBaseUrl(settings.apiBaseUrl);
};
