require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('../data/image-datas.js')

function genImageURL(imageDatasArr) {
  for (var i = 0; i < imageDatasArr.length; i++) {
    var singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName)

    imageDatasArr[i] = singleImageData
  }
  return imageDatasArr
}

imageDatas = genImageURL(imageDatas)

/**
 * 获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}

/**
 * 获取 -30deg~30deg 之间的一个随机值
 */
function get30DegRandom() {
  return getRangeRandom(-30, 30)
}

class ImgFigure extends React.Component {
  render() {
    let styleObj = {}

    //如果props属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos
    }

    //如果图片的旋转角度有值并且不为0，添加旋转角度
    if (this.props.arrange.rotate) {
      ['Webkit', 'Moz', 'Ms'].forEach((item)=>{

        styleObj[`${item}Transform`] = `rotate(${this.props.arrange.rotate}deg)`
      })
    }

    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

/**
 * 以下写法已经随react版本升级而不适用了，虽然能运行，但会有warning
 */
// let ImgFigure = React.createClass({
//   render() {
//     return (
//       <figure className="img-figure">
//         <img src={this.props.data.imageURL} alt={this.props.data.title}/>
//         <figcaption>
//           <h2 className="img-title">{this.props.data.title}</h2>
//         </figcaption>
//       </figure>
//     );
//   }
// })

class AppComponent extends React.Component {

// let AppComponent = React.createClass({



  /**
   * 重新布局所有图片
   * @param  {[number]} centerIndex [居中图片的 index]
   */
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr
    let constant = this.state.constant;

    let centerPos = constant.centerPos
    let hPosRange = constant.hPosRange
    let vPosRange = constant.vPosRange
    let hPosRangeLeftSecX = hPosRange.leftSecX
    let hPosRangeRightSecX = hPosRange.rightSecX
    let hPosRangeY = hPosRange.y

    let vPosRangeX = vPosRange.x
    let vPosRangeTopY = vPosRange.topY

    let imgsArrangeTopArr = []
    let topImgNum = Math.round(Math.random()) //取 0 或 1 个

    let topImgSpliceIndex = 0 //上部区域图片的序号
    let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1) //中心图片

    //首先居中 centerIndex 的图片
    imgsArrangeCenterArr[0].pos = centerPos

    //居中的 centerIndex 图片不需要旋转
    imgsArrangeCenterArr[0].rotate = 0

    // 取出要布局上部区域的图片的状态信息
    topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum))
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum)

    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach((item, index)=>{
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom()
      }
    })

    // 布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局在左边，右半部分布局在右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX
      } else {
        hPosRangeLORX = hPosRangeRightSecX
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom()
      }
    }

    //还原原图片数组
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
    }

    imgsArrangeArr.splice(centerIndex, 0 , imgsArrangeCenterArr[0])

    this.setState({
      imgsArrangeArr
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [
        /*{
          pos: {
            left: '0',
            top: '0'
          },
          rotate: 0 //旋转角度
        } */
      ],

      //constant存储排布的可取值范围
      constant: {
        centerPos: { //中心图片的位置
          left: 0,
          top: 0
        },
        hPosRange: { //水平方向的取值范围
          leftSecX: [0, 0],
          rightSecX: [0, 0],
          y: [0, 0]
        },
        vPosRange: { //垂直方向的取值范围
          x: [0, 0],
          topY: [0, 0]
        }
      }
    }
  }

  // getInitialState() {
  //   return {
  //     imgsArrangeArr: [
  //       /*{
  //         pos: {
  //           left: '0',
  //           top: '0'
  //         }
  //       } */
  //     ]
  //   }
  // }

  // 组件加载后，为每张图片计算其位置的范围
  componentDidMount() {

    // 首先拿到舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage);
    let stageW = stageDOM.scrollWidth;
    let stageH = stageDOM.scrollHeight;
    let halfStageW = Math.floor(stageW / 2);
    let halfStageH = Math.floor(stageH / 2);

    //拿到一个 imgFigure 的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
    let imgW = imgFigureDOM.scrollWidth;
    let imgH = imgFigureDOM.scrollHeight;
    let halfImgW = Math.floor(imgW / 2);
    let halfImgH = Math.floor(imgH / 2);

    //计算中心图片的位置点
    this.state.constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 计算左侧、右侧区域图片排布位置的取值范围
    this.state.constant.hPosRange.leftSecX[0] = -halfImgW;
    this.state.constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.state.constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.state.constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.state.constant.hPosRange.y[0] = -halfImgH;
    this.state.constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的取值范围
    this.state.constant.vPosRange.topY[0] = -halfImgH;
    this.state.constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.state.constant.vPosRange.x[0] = halfStageW - imgW;
    this.state.constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }



  render() {

    let controllerUnits = [];
    let ImgFigures = [];
    imageDatas.forEach((item, index)=> {

      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0
        }
      }

      ImgFigures.push(
        <ImgFigure data={item} key={`ImgFigure${index}`} ref={`imgFigure${index}`} arrange={this.state.imgsArrangeArr[index]}></ImgFigure>
      )
    })

    // console.log(ImgFigures);

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {ImgFigures}
        </section>

        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
