moment.locale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s',
      s:  'seconds',
      ss: '%ss',
      m:  '1 min',
      mm: '%d min',
      h:  '1 hour',
      hh: '%d hours',
      d:  '1 day',
      dd: '%d days',
      M:  '1 month',
      MM: '%d months',
      y:  '1 year',
      yy: '%d years'
    }
  });

function round(value, numDec)
{
    var dec = Math.pow(10, numDec);
    return Math.round(value * dec) / dec;
}

function setAppVersion(version)
{
    var li = $("<li/>", {class: "mdl-menu__item", onclick: "window.open('https://github.com/lurume84/bling-desktop', '_blank')", html: "<i class=\"fas fa-desktop\"></i>&nbsp;Desktop " + version})
    li.appendTo($("#moremenu"));
}

function base64Encode(str)
{
    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var out = "", i = 0, len = str.length, c1, c2, c3;
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += CHARS.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += CHARS.charAt(c1 >> 2);
        out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += CHARS.charAt(c3 & 0x3F);
    }
    return out;
}