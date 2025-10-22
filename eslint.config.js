// eslint.config.mjs
// @ts-check
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react' // Thêm plugin react cơ bản
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    // 1. Cấu hình ngôn ngữ và parser
    languageOptions: {
      parser: tseslint.parser, // Sử dụng parser của TypeScript ESLint
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest', // Dùng latest như config cũ
        sourceType: 'module'
        // project: ['./tsconfig.json'], // Bỏ ghi chú nếu dùng các quy tắc type-aware
      },
      globals: {
        ...globals.browser,
        ...globals.node, // Thêm globals của Node.js như config cũ
        es2020: true // Thêm env es2020 như config cũ
      }
    },
    // 2. Cấu hình cài đặt cho plugins
    settings: {
      react: {
        version: 'detect' // Hoặc '18.2'
      }
    },
    // 3. Định nghĩa các plugins
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    // 4. Kế thừa các cấu hình chuẩn
    // Chúng ta không dùng extends nhiều nữa mà định nghĩa rules trực tiếp ở dưới
    // ...tseslint.configs.recommended,

    // 5. Thêm TẤT CẢ các quy tắc tùy chỉnh từ config cũ vào đây
    rules: {
      // --- Quy tắc chuẩn bị từ các extends ---
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules, // Hỗ trợ JSX transform
      ...reactHooks.configs.recommended.rules,

      // --- Quy tắc tùy chỉnh từ cấu hình của bạn ---
      'react-refresh/only-export-components': 'warn',
      // Các quy tắc của react-hooks đã có trong "extends" recommended ở trên

      'no-console': 1, // 'warn'
      'no-lonely-if': 1, // 'warn'
      // Tắt no-unused-vars mặc định để dùng bản của TS ESLint
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 1, // 'warn'

      'no-trailing-spaces': 1,
      'no-multi-spaces': 1,
      'no-multiple-empty-lines': 1,
      'space-before-blocks': ['error', 'always'],
      'object-curly-spacing': [1, 'always'],
      indent: ['warn', 2],
      semi: [1, 'never'],
      quotes: ['error', 'single'],
      'array-bracket-spacing': 1,
      'linebreak-style': 0, // Tắt kiểm tra linebreak style
      'no-unexpected-multiline': 'warn',
      'keyword-spacing': 1,
      'comma-dangle': 1,
      'comma-spacing': 1,
      'arrow-spacing': 1

      // Các quy tắc React từ config cũ đã được cover bởi recommended hoặc là deprecated
      // 'react/prop-types': 0, // Đã tắt mặc định khi dùng TS
      // 'react/display-name': 0, // Đã tắt mặc định khi dùng TS
    }
  }
])
