import { Injectable } from '@angular/core';

type IconMap = Map<string, string[]>;

function convertClass(input: string = 'svg'): string {
  const classes = input.trim().replace(/\:/g, '-');
  return `ngx-icon ${classes}`;
}

@Injectable()
export abstract class IconRegisteryService {

  private _defaultFontSetClass: string = 'icon';
  private _iconMap: IconMap = new Map();

  setDefaultFontSetClass(iconSet) {
    if (!arguments.length) return this._defaultFontSetClass;
    this._defaultFontSetClass = iconSet;
  }

  get(keys: any): string[] {
    return this.lookup(keys)
      .map(k => convertClass(k));
  }

  lookup(keys: any): string[] {
    return (Array.isArray(keys) ? keys : [keys])
      .reduce((p: string[], k: string) => {
        k = this._expandKeys(k).map(kk => {
          const x = this._iconMap.get(kk);
          return (x && x.length === 1) ? x[0] : kk;
        }).join(' ');
        return p.concat(this._iconMap.get(k) || [k]);
      }, []);
  }

  add(key: string, icon: any): void {
    key = this._expandKeys(key).join(' ');
    icon = this.lookup(icon);
    this._iconMap.set(key, icon);
  }

  private _expandKeys(key: string): string[] {
    return key.split(' ').map(k => {
      if (k.includes(':')) return k;
      return `${this._defaultFontSetClass}:${k}`;
    });
  }
}
