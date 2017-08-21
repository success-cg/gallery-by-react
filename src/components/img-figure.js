import React from 'react';

class ImgFigure extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this)
    // console.log(this);
  }

  /**
   * ImgFigure 的点击处理函数
   * @return {[type]} [description]
   */
  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();

    if (this.props.arrange.isCenter) {
      this.props.inverse()
    } else {
      this.props.center()
    }

    // console.log(this);
  }

  render() {
    let styleObj = {}

    //如果props属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos
    }

    //如果图片的旋转角度有值并且不为0，添加旋转角度
    if (this.props.arrange.rotate) {
      ['Webkit', 'Moz', 'Ms'].forEach((item) => {
        styleObj[`${item}Transform`] = `rotate(${this.props.arrange.rotate}deg)`
      })
    }

    let imgFigureClassName = 'img-figure';
    if (this.props.arrange.isInverse) {
      imgFigureClassName += ' is-inverse'
    }

    // console.log('this',this);

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

module.exports = ImgFigure
