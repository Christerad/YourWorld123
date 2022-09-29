import {  IonRow, IonCol ,IonImg,IonButton, IonLabel} from '@ionic/react';
import React, { useState, useRef } from 'react';


const LevelController : React.FC< {LvL : number}> = (props) => {
    
    return (
    <IonRow>
       <IonRow>
        <IonLabel>Level : {props.LvL}</IonLabel>
        </IonRow>
        <IonRow>

    </IonRow>
    </IonRow>
   
    );
};
  
  export default LevelController;
