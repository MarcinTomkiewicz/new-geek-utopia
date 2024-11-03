export interface ILocaleItem {
    key: string;
    content: string;
}

export interface ILocaleCollection { 
    [key: string]: string;
}

export interface ILocaleGroups {
    [group: string]: string[];
  }

  export interface IGroupedLocales {
    [group: string]: { [key: string]: string };
  }

  export interface ILocalesResponse {
    [group: string]: ILocaleCollection;
  }