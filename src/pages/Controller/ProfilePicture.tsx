import {  IonRow, IonCol ,IonImg,IonThumbnail, IonToolbar, IonText, isPlatform} from '@ionic/react';
import React, { useState, useRef } from 'react';
import "./ProfilePicture.css";
import { useHistory } from 'react-router';

// const ProfilePicture : React.FC< pictureUrl: string> = (props) => {
const ProfilePicture : React.FC< {PhotoUrl :string}> = (props) => {
    const history = useHistory();

    const gettoprofile=()=>{

      history.push("/Profile")
    }

    return (
    <IonRow>

      <IonCol className="ion-text-center">
       <IonThumbnail class='RoundedIonThumbnail'>
          <IonImg src={props.PhotoUrl}  onClick={()=>gettoprofile()} />
        </IonThumbnail>
      </IonCol>
    </IonRow>
    );
};
  
  export default ProfilePicture;