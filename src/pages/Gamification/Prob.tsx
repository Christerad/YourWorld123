import { IonContent, IonPage, IonTitle, IonToolbar, IonRow, IonCol ,IonImg,IonText
    , IonItem, IonLabel, IonFab, IonFabButton, IonGrid, IonButton, IonModal, IonAlert,} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { personCircle,calendar, documentText, podium, trophy, add } from "ionicons/icons";
import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router';

import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const Prob: React.FC = () => {
    //console.log('Opening World')
    const [ProfilePhotoURL, SetProfilePhotoURL] = useState<string | any>()
    const [Username, SetUsername] = useState<string | any>()
    const [Level, SetLevel] = useState<Number | any>()
    const [XP, SetXP] = useState<Number| any>()
    const [UID,SetUID] = useState<string | any>()
    const [showAlert1, setShowAlert1] = useState(false);

    
    const [ErrorMessage, SetErrorMessage]=useState('')
    const [ErrorCode, SetErrorCode]=useState('')
 
    const [FieldTicket,SetFieldTicket]=useState<Number| any>()
    const FieldTicketRef=useRef<Number| any>()

    const [showModalNewField, setShowModalNewField] = useState(false);

    
    
    const AddLevelUID=()=>{
        const newPostKey = push(child(ref(db), 'Probs/60/Prob')).key;
        const ProbData = {
            Prob:0,
            PlantID:0     
        };

        update(ref(db,'Probs/60/Prob' + newPostKey), ProbData).then(() => {
            // Data saved successfully!
            console.log('Success')
        });
    }
    // const AddITemUID=()=>{
    //     const newPostKey = push(child(ref(db), 'Probs/Level1-10/Plants')).key;
    //     const ProbData = {
    //         PlantID : 0    
    //     };
    //     update(ref(db,'Probs/Level1-10/Plants' + newPostKey), ProbData).then(() => {
    //         // Data saved successfully!
    //         console.log('Success')
    //     });
    // }
    
    const db = getDatabase();
    //console.log('db :',db)


return(
<IonPage>
    <IonContent>

        <IonButton onClick={()=>AddLevelUID()}>Add Level ID</IonButton>
        {/* <IonButton onClick={()=>AddITemUID()}>Add Item ID</IonButton> */}

    </IonContent>
</IonPage>

);

};
export default Prob;