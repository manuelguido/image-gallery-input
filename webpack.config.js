const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './src/components/ImageGalleryInput.vue',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'image-gallery-input.js',
    libraryTarget: 'umd',
    library: 'ImageGalleryInput',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue']
  },
  plugins: [
    new VueLoaderPlugin()
  ],  
};
