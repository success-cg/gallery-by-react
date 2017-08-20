require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let imageDatas = require('../data/image-datas.js')


function genImageURL(imageDatasArr) {
  for(var i=0; i<imageDatasArr.length; i++){
    var singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName)

    imageDatasArr[i] = singleImageData
  }
  return imageDatasArr
}

imageDatas = genImageURL(imageDatas)
// console.log(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">

        </section>

        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
