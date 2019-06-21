import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsSevice {

  public damerauLevenshteinDistance(source, target) {
    if (!source || source.length === 0) {
      if (!target || target.length === 0) {
        return 0;
      } else {
        return target.length;
      }
    } else if (!target) {
      return source.length;
    }
    const sourceLength = source.length;
    const targetLength = target.length;
    const score = [];

    const INF = sourceLength + targetLength;
    score[0] = [INF];
    for (let i = 0; i <= sourceLength; i++) { score[i + 1] = []; score[i + 1][1] = i; score[i + 1][0] = INF; }
    for (let i = 0; i <= targetLength; i++) { score[1][i + 1] = i; score[0][i + 1] = INF; }

    const sd = {};
    const combinedStrings = source + target;
    const combinedStringsLength = combinedStrings.length;
    for (let i = 0; i < combinedStringsLength; i++) {
      const letter = combinedStrings[i];
      if (!sd.hasOwnProperty(letter)) {
        sd[letter] = 0;
      }
    }

    for (let i = 1; i <= sourceLength; i++) {
      let DB = 0;
      for (let j = 1; j <= targetLength; j++) {
        const i1 = sd[target[j - 1]];
        const j1 = DB;

        if (source[i - 1] === target[j - 1]) {
          score[i + 1][j + 1] = score[i][j];
          DB = j;
        } else {
          score[i + 1][j + 1] = Math.min(score[i][j], Math.min(score[i + 1][j], score[i][j + 1])) + 1;
        }

        score[i + 1][j + 1] = Math.min(score[i + 1][j + 1], score[i1][j1] + (i - i1 - 1) + 1 + (j - j1 - 1));
      }
      sd[source[i - 1]] = i;
    }

    return score[sourceLength + 1][targetLength + 1];
  }

  public groupBy(items: any[], key: string) {
    return items.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [
          ...(result[item[key]] || []),
          item,
        ],
      }),
      {},
    );
  }

  public getRegexGroup(input: string, regex: any, index: number): string {
    let data = '';
    let m;

    while ((m = regex.exec(input)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
          if (groupIndex === index) {
            data = match;
          }
      });
    }

    return data;
  }
}
