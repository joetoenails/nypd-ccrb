import React from 'react';
import {legend} from './formOptions'

export const SubmitButton = props => {
  console.log('props', props)
  const {slice1,slice2, slice3, currentView} = props;
  const buttonView = currentView.slice(1)
  
  const makeString = (views) =>{
    let arr = [];
    for(let i = 0; i < views.length; i++) {
      const key = props['slice' + [i+1]]
      console.log('LLLL',legend)
      console.log('KKKK',key)
      console.log(legend[key])
      let str = ''
      str += legend[props['slice' + [i+1]]]
      str += ' : '
      str += views[i]
      arr.push(str)
    }
    if(!arr.length) return 'Get All Allegations'
    return arr.join('\n')
  }

  
return (<button>{makeString(buttonView)}</button>)
}