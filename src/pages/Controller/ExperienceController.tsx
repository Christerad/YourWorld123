import {  IonRow, IonCol ,IonItem,IonButton, IonLabel ,IonProgressBar} from '@ionic/react';
import React, { useState, useRef } from 'react';


// const ProfilePicture : React.FC< pictureUrl: string> = (props) => {
const ExperienceController : React.FC< {XP : number,LvL: number, MaxXP: number}> = (props) => {
    const valueProgessbar1=props.XP/props.MaxXP
    //console.log('percent:',valueProgessbar1)
    return (
        <IonRow > 
            <IonCol>
                <IonLabel>XP: {props.XP} </IonLabel>
            </IonCol>
            <IonCol class='ion-align-self-end'>
                <IonLabel> Max XP: {props.MaxXP} </IonLabel>
            </IonCol>
            <IonProgressBar value={valueProgessbar1} />
        </IonRow>
       
        
    );
};
  
  export default ExperienceController;