import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol ,IonImg, IonText
    , IonInput, IonItem, IonLabel, IonLoading ,IonTabBar, IonTabButton, IonRouterOutlet, IonList, IonListHeader, IonAlert} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { personCircle,calendar, documentText, podium, trophy, globe } from "ionicons/icons";
import React, { useState, useRef, useEffect } from 'react';


import { getDatabase, ref, onValue, get, push, child, update, query, orderByChild, equalTo} from "firebase/database";


import GoldTrophy from '../../components/Image/GoldThrophy.png'
import SilverTrophy from '../../components/Image/SilverThrophy.png'
import CopperTrophy from '../../components/Image/CopperThrophy.png'
import UnfoundTrophy from '../../components/Image/UnfoundThrophy.png'

import "./Achievements.css" 

const AchievementsList2: React.FC<{UID :string}> = (props) => {
    console.log('AchievementList,UID :',props.UID)

    const [showLoading, setShowLoading] = useState(true);

   const [TaskCount,SetTaskCount]=useState<number | any>(0)
   const [StudyCount,SetStudyCount]=useState<number | any>()
   const [ClassCount,SetClassCount]=useState<number | any>()
   const [TestCount,SetTestCount]=useState<number | any>()
   const [HomeworkCount,SetHomeworkCount]=useState<number | any>()
   const [EasyCount,SetEasyCount]=useState<number | any>()
   const [MedCount,SetMedCount]=useState<number | any>()
   const [HardCount,SetHardCount]=useState<number | any>()
   const [VHardCount,SetVHardCount]=useState<number | any>()

   const snapshotToArray = (snapshot: any) => {
        const returnArr: any[] = []
        snapshot.forEach((childSnapshot: any) => {   
            console.log('childsnapshot :',childSnapshot.key)
            const item = childSnapshot.val()
            item.key = childSnapshot.key
            if(childSnapshot.val().StatusSelesai==false){
            console.log('childsnapshot True :',childSnapshot.key)
            returnArr.push(item)

            }
        });
        return returnArr;
    }
    
    const GetSuccessTaskDiff1= async ()=>{
        var Hello=0

        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+props.UID)
        );

        onValue(mostViewedPosts22, (snapshot) => {
            let data1 = snapshotToArray(snapshot) 
            //  console.log(data1)

             snapshot.forEach((childsnapshot)=>{
                if(childsnapshot.val().Difficulty==1 && childsnapshot.val().StatusSelesai==true)
                {
                    Hello=Hello+1
                }
              })
              SetEasyCount(Hello);
        });
    }



    const GetSuccessTaskDiff2= async ()=>{
        var Hello=0
        
        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+props.UID)
          ,orderByChild("DateBerhasil")
        );

        onValue(mostViewedPosts22, (snapshot) => {
            let data1 = snapshotToArray(snapshot) 
            //  console.log(data1)

             snapshot.forEach((childsnapshot)=>{
                if(childsnapshot.val().Difficulty==2 && childsnapshot.val().StatusSelesai==true)
                {
                    Hello=Hello+1
                }
              })
              SetMedCount(Hello);
        });
    }

   

    const GetSuccessTaskDiff3= async ()=>{
        var Hello=0
        
        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+props.UID)
          ,orderByChild("DateBerhasil")
        );

        onValue(mostViewedPosts22, (snapshot) => {
            let data1 = snapshotToArray(snapshot) 
            //  console.log(data1)

             snapshot.forEach((childsnapshot)=>{
                if(childsnapshot.val().Difficulty==3 && childsnapshot.val().StatusSelesai==true)
                {
                    Hello=Hello+1
                }
              })
              SetHardCount(Hello);
        });
    }

    

    const GetSuccessTaskDiff4= async ()=>{
        var Hello=0
        
        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+props.UID)
          ,orderByChild("DateBerhasil")
        );

        onValue(mostViewedPosts22, (snapshot) => {
            let data1 = snapshotToArray(snapshot) 
            //  console.log(data1)

             snapshot.forEach((childsnapshot)=>{
                if(childsnapshot.val().Difficulty==4 && childsnapshot.val().StatusSelesai==true)
                {
                    Hello=Hello+1
                }
              })
              SetVHardCount(Hello);
        });
    }

    const db = getDatabase();
    
    async function  GetUSerData(){
            console.log('UID :',props.UID)
            const QueryUserData =query(ref(db, 'users/' + props.UID));
            onValue(QueryUserData, (snapshot) => {
                if(snapshot.exists()){

                    console.log('data found')
                    console.log(snapshot.val()) 
                    SetTaskCount(snapshot.val().TaskDone)
                    SetStudyCount(snapshot.val().TaskStudyDone)
                    SetHomeworkCount(snapshot.val().TaskHomeWorkDone)
                    SetClassCount(snapshot.val().TaskClassDone)
                    SetTestCount(snapshot.val().TaskTestDone)
                    console.log(snapshot.val()) 
 
                    //let data1 = snapshotToArray(snapshot) 
                    //setData(data1)
                     
                   //console.log('TaskDone :',snapshot.val().TaskDone)
                   setShowLoading(false);
                }
                else{
                    console.log('data not found')
                    setShowLoading(false);
                }
            });

            GetSuccessTaskDiff1()
            GetSuccessTaskDiff2()
            GetSuccessTaskDiff3()
            GetSuccessTaskDiff4()


            // const DiffEasy = query(ref(db, '/Schedule/' + props.UID), orderByChild("Difficulty"), equalTo(1));
            // onValue(DiffEasy, (snapshot) => {
            //     let data1 = snapshotToArray(snapshot);
            //     if (data1.length > 0) {
            //     console.log('Count(*) :', data1.length);
            //     //setShowAlert1(true);
            //     }
            //     })

    }
    useEffect(() => {
        GetUSerData()
    }, [props.UID])
    
return(
    <IonCol>
    <IonList class='blurred-box'>
        <IonListHeader> Achievements </IonListHeader>
        <IonItem class='IonItemRoundedDoang'>
            <IonCol>
                <IonRow>
                    <IonLabel>Task Done  : {TaskCount}</IonLabel>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>10 </IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {TaskCount>=10 && (
                                <IonImg class='ImgThrophy' src={CopperTrophy}/>
                            )}
                            {TaskCount<10 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>100</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {TaskCount>=100 && (
                                <IonImg class='ImgThrophy' src={SilverTrophy}/>
                            )}
                            {TaskCount<100 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'  >500</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {TaskCount>=500 && (
                                <IonImg class='ImgThrophy' src={GoldTrophy}/>
                            )}
                            {TaskCount<500 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonCol>
        </IonItem>
        <IonItem class='IonItemRoundedDoang'>
            <IonCol>
                <IonRow>
                    <IonLabel>Study Task Done :{StudyCount} </IonLabel>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>50 </IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {StudyCount>=50 && (
                                <IonImg class='ImgThrophy' src={CopperTrophy}/>
                            )}
                            {StudyCount<50 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>100</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {StudyCount>=100 && (
                                <IonImg class='ImgThrophy' src={SilverTrophy}/>

                            )}
                            {StudyCount<100 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>1000</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {StudyCount>=1000 && (
                                <IonImg class='ImgThrophy' src={GoldTrophy}/>
                            )}
                            {StudyCount<1000 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonCol>
        </IonItem>
        <IonItem class='IonItemRoundedDoang'>
            <IonCol>
                <IonRow>
                    <IonLabel>Class Task Done  :{ClassCount} </IonLabel>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>50 </IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {ClassCount>=50 && (
                                <IonImg class='ImgThrophy' src={CopperTrophy}/>
                            )}
                            {ClassCount<50 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>100</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {ClassCount>=100 && (
                                <IonImg class='ImgThrophy' src={SilverTrophy}/>
                            )}
                            {ClassCount<100 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>150</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {ClassCount>=150 && (
                                <IonImg class='ImgThrophy' src={GoldTrophy}/>
                            )}
                            {ClassCount<150 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonCol>
        </IonItem>
        <IonItem class='IonItemRoundedDoang'>
            <IonCol>
                <IonRow>
                    <IonLabel>Test Task Done  : {TestCount}</IonLabel>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>5 </IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {TestCount>=5 && (
                                <IonImg class='ImgThrophy' src={CopperTrophy}/>
                            )}
                            {TestCount<5 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>10</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {TestCount>=10 && (
                                <IonImg class='ImgThrophy' src={SilverTrophy}/>
                            )}
                            {TestCount<10 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>20</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {TestCount>=20 && (
                                <IonImg class='ImgThrophy' src={GoldTrophy}/>
                            )}
                            {TestCount<20 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonCol>
        </IonItem>
        <IonItem class='IonItemRoundedDoang'>
            <IonCol>
                <IonRow>
                    <IonLabel>HomeWork Task Done : {HomeworkCount} </IonLabel>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>50 </IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {HomeworkCount>=50 && (
                                <IonImg class='ImgThrophy' src={CopperTrophy}/>
                            )}
                            {HomeworkCount<50 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>100</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {HomeworkCount>=100 && (
                                <IonImg class='ImgThrophy' src={SilverTrophy}/>
                            )}
                            {HomeworkCount<100 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>200</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {HomeworkCount>=200 && (
                                <IonImg class='ImgThrophy' src={GoldTrophy}/>
                            )}
                            {HomeworkCount<200 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonCol>
        </IonItem>
                <IonItem class='IonItemRoundedDoang'>
            <IonCol>
                <IonRow>
                    <IonLabel>Study Task Done :{StudyCount} </IonLabel>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>50 </IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {StudyCount>=50 && (
                                <IonImg class='ImgThrophy' src={CopperTrophy}/>
                            )}
                            {StudyCount<50 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>100</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {StudyCount>=100 && (
                                <IonImg class='ImgThrophy' src={SilverTrophy}/>

                            )}
                            {StudyCount<100 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>1000</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {StudyCount>=1000 && (
                                <IonImg class='ImgThrophy' src={GoldTrophy}/>
                            )}
                            {StudyCount<1000 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonCol>
        </IonItem>
        <IonItem class='IonItemRoundedDoang'>
            <IonCol>
                <IonRow>
                    <IonLabel> Task Done (Under 1 Hour) :{EasyCount} </IonLabel>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>50 </IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {EasyCount>=50 && (
                                <IonImg class='ImgThrophy' src={CopperTrophy}/>
                            )}
                            {EasyCount<50 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>100</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {EasyCount>=100 && (
                                <IonImg class='ImgThrophy' src={SilverTrophy}/>

                            )}
                            {EasyCount<100 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>1000</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {EasyCount>=1000 && (
                                <IonImg class='ImgThrophy' src={GoldTrophy}/>
                            )}
                            {EasyCount<1000 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonCol>
        </IonItem>
        <IonItem class='IonItemRoundedDoang'>
            <IonCol>
                <IonRow>
                    <IonLabel> Task Done (Between 1-2 Hours) :{MedCount} </IonLabel>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>50 </IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {MedCount>=50 && (
                                <IonImg class='ImgThrophy' src={CopperTrophy}/>
                            )}
                            {MedCount<50 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>100</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {MedCount>=100 && (
                                <IonImg class='ImgThrophy' src={SilverTrophy}/>

                            )}
                            {MedCount<100 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>1000</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {MedCount>=1000 && (
                                <IonImg class='ImgThrophy' src={GoldTrophy}/>
                            )}
                            {MedCount<1000 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonCol>
        </IonItem>
        <IonItem class='IonItemRoundedDoang'>
            <IonCol>
                <IonRow>
                <IonLabel> Task Done (Between 2-4 Hours) :{HardCount} </IonLabel>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>50 </IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {HardCount>=50 && (
                                <IonImg class='ImgThrophy' src={CopperTrophy}/>
                            )}
                            {HardCount<50 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>100</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {HardCount>=100 && (
                                <IonImg class='ImgThrophy' src={SilverTrophy}/>

                            )}
                            {HardCount<100 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>1000</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {HardCount>=1000 && (
                                <IonImg class='ImgThrophy' src={GoldTrophy}/>
                            )}
                            {HardCount<1000 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonCol>
        </IonItem>
        <IonItem class='IonItemRoundedDoang'>
            <IonCol>
                <IonRow>
                    <IonLabel> Task Done (Above 6 Hour) :{VHardCount} </IonLabel>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>50 </IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {VHardCount>=50 && (
                                <IonImg class='ImgThrophy' src={CopperTrophy}/>
                            )}
                            {VHardCount<50 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>100</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {VHardCount>=100 && (
                                <IonImg class='ImgThrophy' src={SilverTrophy}/>

                            )}
                            {VHardCount<100 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonRow class='ion-justify-content-center'>1000</IonRow>
                        <IonRow class='ion-justify-content-center'>
                            {VHardCount>=1000 && (
                                <IonImg class='ImgThrophy' src={GoldTrophy}/>
                            )}
                            {VHardCount<1000 && (
                                <IonImg class='ImgThrophy' src={UnfoundTrophy}/>
                            )}
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonCol>
        </IonItem>
    </IonList>
    <IonLoading
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Loading...'}
        />
    </IonCol>

)
};
export default AchievementsList2;