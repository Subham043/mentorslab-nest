import { PipeTransform, Injectable } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class RemoveUnsafeHtmlPipe implements PipeTransform {
  async transform(value: object) {
    const data = value;
    (Object.keys(value) as (keyof typeof value)[]).forEach(async (key) => {
      data[key] = this.sanitize(value[key]) as never;
    });
    return data;
  }

  private sanitize(value: string): any {
    return sanitizeHtml(value, {
      allowedTags: [
        'address',
        'article',
        'aside',
        'footer',
        'header',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'hgroup',
        'main',
        'nav',
        'section',
        'blockquote',
        'dd',
        'div',
        'dl',
        'dt',
        'figcaption',
        'figure',
        'hr',
        'li',
        'main',
        'ol',
        'p',
        'pre',
        'ul',
        'a',
        'abbr',
        'b',
        'bdi',
        'bdo',
        'br',
        'cite',
        'code',
        'data',
        'dfn',
        'em',
        'i',
        'kbd',
        'mark',
        'q',
        'rb',
        'rp',
        'rt',
        'rtc',
        'ruby',
        's',
        'samp',
        'small',
        'span',
        'strong',
        'sub',
        'sup',
        'time',
        'u',
        'var',
        'wbr',
        'caption',
        'col',
        'colgroup',
        'table',
        'tbody',
        'td',
        'tfoot',
        'th',
        'thead',
        'tr',
        'iframe',
      ],
      disallowedTagsMode: 'escape',
      allowedAttributes: {
        a: ['href', 'name', 'target'],
        // We don't currently allow img itself by default, but
        // these attributes would make sense if we did.
        img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
        iframe: ['src'],
      },
      // Lots of these won't come up by default because we don't allow them
      selfClosing: [
        'img',
        'br',
        'hr',
        'area',
        'base',
        'basefont',
        'input',
        'link',
        'meta',
      ],
      allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
      // URL schemes we permit
      allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel'],
      allowedSchemesByTag: {},
      allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
      allowProtocolRelative: true,
      enforceHtmlBoundary: false,
      parseStyleAttributes: true,
    });
  }
}
