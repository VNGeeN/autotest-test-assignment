import axios, { AxiosResponse } from 'axios';
import { config } from './config';

export interface Issue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
}

export class ApiClient {
  private baseURL: string;
  private headers: any;

  constructor() {
    this.baseURL = config.api.baseUrl;
    this.headers = {
      'Authorization': `Bearer ${config.api.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };
  }

  async createIssue(title: string, body?: string, labels?: string[]): Promise<AxiosResponse<Issue>> {
    const url = `${this.baseURL}/repos/${config.api.owner}/${config.api.repo}/issues`;
    
    const data: any = { title };
    if (body) data.body = body;
    if (labels) data.labels = labels;

    return axios.post(url, data, { headers: this.headers });
  }

  async getIssue(issueNumber: number): Promise<AxiosResponse<Issue>> {
    const url = `${this.baseURL}/repos/${config.api.owner}/${config.api.repo}/issues/${issueNumber}`;
    return axios.get(url, { headers: this.headers });
  }

  async closeIssue(issueNumber: number): Promise<AxiosResponse<Issue>> {
    const url = `${this.baseURL}/repos/${config.api.owner}/${config.api.repo}/issues/${issueNumber}`;
    return axios.patch(url, { state: 'closed' }, { headers: this.headers });
  }
}

export const apiClient = new ApiClient();