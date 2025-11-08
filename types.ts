export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface DribbbleShot {
  id: number;
  title: string;
  images: {
    normal: string;
    hidpi: string;
  };
  html_url: string;
}

export enum DeploymentType {
  NONE,
  WEB,
  APP_STORE
}

export enum WebDeploymentStatus {
  IDLE,
  CONNECTING_GITHUB,
  PUBLISHING_VERCEL,
  SUCCESS,
  ERROR
}

export enum AppStoreDeploymentStatus {
  IDLE,
  CREDENTIALS,
  QUEUED,
  BUILDING,
  DOWNLOADING,
  UPLOADING,
  SUCCESS,
  ERROR
}