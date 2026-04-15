module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern:
        /^\[(FIX|ADD|UPDATE|FEAT|REMOVE|REFACTOR|DOCS|STYLE|TEST|CHORE)\]\s(.+)$/,
      headerCorrespondence: ['type', 'subject'],
    },
  },
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'FIX',
        'ADD',
        'UPDATE',
        'FEAT',
        'REMOVE',
        'REFACTOR',
        'DOCS',
        'STYLE',
        'TEST',
        'CHORE',
      ],
    ],
    'type-case': [2, 'always', 'upper-case'],
    'subject-empty': [2, 'never'],
  },
};
