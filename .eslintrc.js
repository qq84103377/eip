module.exports = {
  "root": true,
  "env": {
   "node": true
  },
  "extends": [
   "plugin:vue/recommended",
   "eslint:recommended"
  ],
  "rules": {
      "indent": ["error", 2],
      "semi": ['error', 'never'], //语句结尾去掉分号
   "dot-location": [
    2,
    "property"
   ],
   "comma-spacing": [1],
   "space-before-blocks": [
    2,
    "always"
   ], // 强制在块之前使用一致的空格
   "space-unary-ops": [
    2,
    {
     "words": true,
     "nonwords": false
    }
   ], // 强制在一元操作符前后使用一致的空格
   "array-bracket-spacing": [
    2,
    "never"
   ], // 强制数组方括号中使用一致的空格
   "quotes": [
    0,
    "double"
   ], // 强制使用一致的反勾号、双引号或单引号
   "arrow-spacing": [
    2,
    {
     "before": true,
     "after": true
    }
   ],
   "vue/max-attributes-per-line":0,
   "no-var": 2, //禁用var，用let和const代替
   "no-mixed-spaces-and-tabs": 2, // 禁止空格和 tab 的混合缩进
   "no-trailing-spaces": 1, // 禁用行尾空格
   "no-unexpected-multiline": 2, // 禁止出现令人困惑的多行表达式
   "no-unused-vars": [
    2,
    {
     "vars": "all",
     "args": "none"
    }
   ], // 禁止出现未使用过的变量
   "vue/html-indent": [
    0,
    "tab"
   ],
   "no-console": process.env.NODE_ENV === 'production' ? 'warn' : 'off',
   "no-debugger": process.env.NODE_ENV === 'production' ? 'warn' : 'off',
   "vue/html-self-closing": [0],
   "vue/multiline-html-element-content-newline": [0],
   "vue/singleline-html-element-content-newline":[0],
   "vue/html-closing-bracket-newline":[0],
   "vue/no-v-html": [0]
  },
  "parserOptions": {
   "parser": "babel-eslint"
  }
 }