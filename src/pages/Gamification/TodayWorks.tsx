import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol
    , IonInput, IonItem, IonLabel, IonButton, IonCard, IonImg, IonAlert, IonText, IonGrid, isPlatform, IonModal, IonRefresher, IonRefresherContent, RefresherEventDetail, IonLoading, IonChip, IonList } from '@ionic/react';
    import { IonIcon } from '@ionic/react';
    import { bookSharp, chevronDownCircleOutline, clipboard, documentsSharp, logoGoogle, schoolSharp } from "ionicons/icons";
    import './TodayWorks.css'
    import { useHistory } from 'react-router';
    import { useEffect, useState } from 'react';
    import { getAuth, signInWithPopup, GoogleAuthProvider,signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth"
    import { getDatabase, ref, child, get, set, query, orderByChild, equalTo, onValue, limitToLast, startAt, endAt, startAfter } from "firebase/database";
    import { format, parseISO,startOfWeek ,endOfWeek,startOfDay, add } from 'date-fns';


    import ProfilePicture from '../Controller/ProfilePicture'
    import LevelController from '../Controller/LevelController'
    import ExperienceController from '../Controller/ExperienceController';


    const TodayWorks: React.FC = () => {

    const [DataEasy, setDataEasy] = useState<any[]>([])
    const [DataMed, setDataMed] = useState<any[]>([])
    const [DataHard, setDataHard] = useState<any[]>([])
    const [DataVHard, setDataVHard] = useState<any[]>([])

    
    const [DataSuccess, setDataSuccess] = useState<any[]>([])
    const [DataFailed, setDataFailed] = useState<any[]>([])
        
    const [showLoading, setShowLoading] = useState(true);

    const [IsEmptyDataEasy, ]=useState(true)
    const [IsEmptyDataMed,setIsEmptyDataMed]=useState(true)
    const [IsEmptyDataHard,setIsEmptyDataHard]=useState(true)
    const [IsEmptyDataVHard,setIsEmptyDataVHard]=useState(true)

    const [ProfilePhotoURL, SetProfilePhotoURL] = useState<string | any>()
    const [Username, SetUsername] = useState<string | any>()
    const [Level, SetLevel] = useState<Number | any>()
    const [XP, SetXP] = useState<Number| any>()
    
    const formatDate = (value: string) => {
        return format(parseISO(value), 'dd MMM yyyy');
    }


    const [TaskEasyDone, SetTaskEasyDone] = useState<Number| any>()
    const [TaskMedDone, SetTaskMedDone] = useState<Number| any>()
    const [TaskHardDone, SetTaskHardDone] = useState<Number| any>()
    const [TaskVHardDone, SetTaskVHardDone] = useState<Number| any>()
    const [TaskFEasyDone, SetTaskFEasyDone] = useState<Number| any>()
    const [TaskFMedDone, SetTaskFMedDone] = useState<Number| any>()
    const [TaskFHardDone, SetTaskFHardDone] = useState<Number| any>()
    const [TaskFVHardDone, SetTaskFVHardDone] = useState<Number| any>()
    const [TaskSuccessToday, SetTaskSuccessToday] = useState<Number| any>()
    const [TaskFailedToday, SetTaskFailedToday] = useState<Number| any>()
    

    const [Currdate,SetCurrdate]=useState('')
    const [L24Date,SetL24Date]=useState('')

    function getCurrentDate(){

        let CurrDate = new Date()
        console.log('Curr Date : ',CurrDate)
         SetCurrdate(format(CurrDate,'yyy-MM-dd HH:mm:ss'))
        //  SetCurrdate(CurrDate)
        // console.log('Converted Curr Date :',format(CurrDate,'yyy-MM-dd HH:mm:ss'))

        let L24= add(new Date(),{days:-1})
        // let L24= add(CurrDate,{days:-1}).toLocaleDateString
        // SetL24Date(L24.toLocaleDateString)
        SetL24Date(format(L24,'yyy-MM-dd HH:mm:ss'))

        //  console.log('Last24 hour Date :',format(L24,'yyy-MM-dd HH:mm:ss'))
    }
    
    
    const [UID,SetUID] = useState<string | any>()

    const getUserPhotoURLname= async (photoURL2: string | null,username : string | null)=>{
        SetProfilePhotoURL(photoURL2);
        SetUsername(username);
    }

    const getUserData= async (uid: string)=>{
        const ref1 = ref(db, 'users/' + uid );
        onValue(ref1, (snapshot) => {
            const data = snapshot.val();
            SetLevel(data.Level)
            SetXP(data.XP)
          });
    }

    const history = useHistory();
    const auth = getAuth();
    const db = getDatabase();
    
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            const UserPhotoURL=user.photoURL;
            const username=user.displayName
            SetUID(uid);
            getUserData(uid);
            getUserPhotoURLname(UserPhotoURL,username);
        } else {
                history.push('/login');
        }
    });

    // function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    //     console.log('Begin async operation');
        
    //     setTimeout(() => {
    //         console.log('Async operation has ended');
    //         event.detail.complete();
    //     }, 2000);
    // }


    const GetSuccessTask= async ()=>{
        // console.log(L24Date)
        // console.log(Currdate)

        // console.log('UID :',UID)
        
        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateBerhasil")
          , startAt(L24Date ) 
          , endAt(Currdate)
        );

        onValue(mostViewedPosts22, (snapshot) => {
            let data1 = snapshotToArray(snapshot) 
            //  console.log(data1)

            if(data1.length!=0){
                SetTaskSuccessToday(data1.length)
            }
            else {
                SetTaskSuccessToday(0)
            }
            // console.log('Jumlah Data Sukses: ',data1.length)
        });
    }

    const GetSuccessTaskDiff1= async ()=>{
        var Hello=0

        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateBerhasil")
          , startAt(L24Date ) 
          , endAt(Currdate)
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
              SetTaskEasyDone(Hello);
        });

        var Hello2=0

        const mostViewedPosts21=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateGagal")
          , startAt(L24Date ) 
          , endAt(Currdate)
        );

        onValue(mostViewedPosts21, (snapshot) => {
            let data1 = snapshotToArray(snapshot) 
            //  console.log(data1)

             snapshot.forEach((childsnapshot)=>{
                if(childsnapshot.val().Difficulty==1 && childsnapshot.val().StatusSelesai==true)
                {
                    Hello2=Hello2+1
                }
              })
              SetTaskFEasyDone(Hello2);
        });
    }



    const GetSuccessTaskDiff2= async ()=>{
        var Hello=0
        
        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateBerhasil")
          , startAt(L24Date ) 
          , endAt(Currdate)
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
              SetTaskMedDone(Hello);
        });

        var Hello2=0

        const mostViewedPosts21=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateGagal")
          , startAt(L24Date ) 
          , endAt(Currdate)
        );

        onValue(mostViewedPosts21, (snapshot) => {
            let data1 = snapshotToArray(snapshot) 
            //  console.log(data1)

             snapshot.forEach((childsnapshot)=>{
                if(childsnapshot.val().Difficulty==2 && childsnapshot.val().StatusSelesai==true)
                {
                    Hello2=Hello2+1
                }
              })
              SetTaskFMedDone(Hello2);
        });
    }

   

    const GetSuccessTaskDiff3= async ()=>{
        var Hello=0
        
        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateBerhasil")
          , startAt(L24Date ) 
          , endAt(Currdate)
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
              SetTaskHardDone(Hello);
        });

        var Hello2=0

        const mostViewedPosts21=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateGagal")
          , startAt(L24Date ) 
          , endAt(Currdate)
        );

        onValue(mostViewedPosts21, (snapshot) => {
            let data1 = snapshotToArray(snapshot) 
            //  console.log(data1)

             snapshot.forEach((childsnapshot)=>{
                if(childsnapshot.val().Difficulty==3 && childsnapshot.val().StatusSelesai==true)
                {
                    Hello2=Hello2+1
                }
              })
              SetTaskFHardDone(Hello2);
        });
    }

    

    const GetSuccessTaskDiff4= async ()=>{
        var Hello=0
        
        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateBerhasil")
          , startAt(L24Date ) 
          , endAt(Currdate)
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
              SetTaskVHardDone(Hello);
        });

        var Hello2=0

        const mostViewedPosts21=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateGagal")
          , startAt(L24Date ) 
          , endAt(Currdate)
        );

        onValue(mostViewedPosts21, (snapshot) => {
            let data1 = snapshotToArray(snapshot) 
            //  console.log(data1)

             snapshot.forEach((childsnapshot)=>{
                if(childsnapshot.val().Difficulty==4 && childsnapshot.val().StatusSelesai==true)
                {
                    Hello2=Hello2+1
                }
              })
              SetTaskFVHardDone(Hello2);
        });
    }

    const GetSuccessTaskList= async ()=>{
        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateBerhasil")
          , startAt(L24Date ) 
          , endAt(Currdate)
        );

        onValue(mostViewedPosts22, (snapshot) => {
            let data1 = snapshotToArrayListDone(snapshot) 
            console.log('Banyak Data  :',data1.length)
            console.log(data1)
            setDataSuccess(data1)
        });
    }

    const GetFailedTaskList= async ()=>{
        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateGagal")
          , startAt(L24Date ) 
          , endAt(Currdate)
        );

        onValue(mostViewedPosts22, (snapshot) => {
            let data1 = snapshotToArrayListDone(snapshot) 
            console.log('Banyak Data  :',data1.length)
            console.log(data1)
            setDataFailed(data1)
        });
    }

    const GetSuccessTaskListDiff1= async ()=>{

        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateBerhasil")
          , startAt(L24Date ) 
          , endAt(Currdate)
        );

        onValue(mostViewedPosts22, (snapshot) => {
            let data1 = snapshotToArrayListDoneDiff(snapshot,1) 
            console.log('Banyak Data East :',data1.length)
            console.log(data1)
            setDataEasy(data1)
        });
    }

    const GetSuccessTaskListDiff2= async ()=>{

        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateBerhasil")
          , startAt(L24Date ) 
          , endAt(Currdate)
        );

        onValue(mostViewedPosts22, (snapshot) => {
            let data1 = snapshotToArrayListDoneDiff(snapshot,2) 
            console.log(data1)
            setDataMed(data1)
        });
    }

    const GetSuccessTaskListDiff3= async ()=>{

        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateBerhasil")
          , startAt(L24Date ) 
          , endAt(Currdate)
        );

        onValue(mostViewedPosts22, (snapshot) => {
            let data1 = snapshotToArrayListDoneDiff(snapshot,3) 
            console.log(data1)
            setDataHard(data1)
        });
    }

    const GetSuccessTaskListDiff4= async ()=>{

        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateBerhasil")
          , startAt(L24Date ) 
          , endAt(Currdate)
        );

        onValue(mostViewedPosts22, (snapshot) => {
            let data1 = snapshotToArrayListDoneDiff(snapshot,4) 
            console.log(data1)
            setDataVHard(data1)
        });
    }

    const GetFailedTask= async ()=>{
        // console.log(L24Date)
        // console.log(Currdate)

        // console.log('UID :',UID)
        
        const mostViewedPosts22=
        query(ref(db, 'Schedule/'+UID)
          ,orderByChild("DateGagal")
          , startAt(L24Date ) 
          , endAt(Currdate)
        );
        
        onValue(mostViewedPosts22, (snapshot) => {
            let data1 = snapshotToArray(snapshot) 
            //  console.log(data1)

            if(data1.length!=0){
                SetTaskFailedToday(data1.length)
            }
            else {
                SetTaskFailedToday(0)
            }
            // console.log('Jumlah Data Gagal : ',data1.length)
        });
    }

    function secondsToTime(e: number){
        const h = Math.floor(e / 3600).toString().padStart(2,'0'),
              m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
              s = Math.floor(e % 60).toString().padStart(2,'0');
        
        return h + ':' + m + ':' + s;
        //return `${h}:${m}:${s}`;
    }

    const snapshotToArray = (snapshot: any) => {
        const returnArr: any[] = []
        snapshot.forEach((childSnapshot: any) => {   
            // console.log('childsnapshot :',childSnapshot.key)
            const item = childSnapshot.val()
            item.key = childSnapshot.key
            // console.log('childsnapshot True :',childSnapshot.key)
            returnArr.push(item)    
        });
        return returnArr;
    }

    const snapshotToArrayListDoneDiff = (snapshot: any,Diffval: number) => {
        const returnArr: any[] = []
        snapshot.forEach((childSnapshot: any) => {   
            console.log('childsnapshot :',childSnapshot.key)
            const item = childSnapshot.val()
            item.key = childSnapshot.key
            if(childSnapshot.val().StatusSelesai==true && childSnapshot.val().Difficulty==Diffval){
                console.log('childsnapshot True :',childSnapshot.key)
                returnArr.push(item)
            }
            // console.log('childsnapshot True :',childSnapshot.key)
            
            // returnArr.push(item)    
        });
        return returnArr;
    }

    const snapshotToArrayListDone = (snapshot: any) => {
        const returnArr: any[] = []
        snapshot.forEach((childSnapshot: any) => {   
            console.log('childsnapshot :',childSnapshot.key)
            const item = childSnapshot.val()
            item.key = childSnapshot.key
            if(childSnapshot.val().StatusSelesai==true){
                console.log('childsnapshot True :',childSnapshot.key)
                returnArr.push(item)
            }
            // console.log('childsnapshot True :',childSnapshot.key)
            
            // returnArr.push(item)    
        });
        return returnArr;
    }

    const loadData =  () => { 
        // setShowLoading(true);
        console.log('Loading Data')
        getCurrentDate()
        GetSuccessTask()
        GetFailedTask()
        GetSuccessTaskDiff1()
        GetSuccessTaskDiff2()
        GetSuccessTaskDiff3()
        GetSuccessTaskDiff4()
        GetSuccessTaskListDiff1()
        GetSuccessTaskListDiff2()
        GetSuccessTaskListDiff3()
        GetSuccessTaskListDiff4()
        GetSuccessTaskList()
        GetFailedTaskList()
        
        setShowLoading(false);

        // const mostViewedPosts =query(ref(db, 'Schedule/'+UID),orderByChild("InUse") , equalTo(true),limitToLast(1)	);
      
        // onValue(mostViewedPosts, (snapshot) => {
          
      
        // });
    }

    useEffect(() => {
        loadData()
    }, [UID])

    
        return(
            <IonPage>
            {isPlatform('desktop') && (
                <IonToolbar >
                    <IonRow class='ion-justify-content-center'>
                        {/* <IonText>Schedule</IonText> */}
                    </IonRow>
                </IonToolbar>
            )}
            <IonContent  class='LoginandRegis'>
                
                 <IonGrid > {/*class='BackgroundYo' style={{ height: "100%" }}>   */}
                    <IonRow  >
                        <IonCol class="ion-text-center" size='size-xs'>
                            <ProfilePicture PhotoUrl={ProfilePhotoURL} />
                        </IonCol>
                        <IonCol>
                            <IonRow>
                                <IonText> {Username} </IonText>
                            </IonRow>
                            <IonRow>
                                <LevelController LvL={Level} />
                            </IonRow>
                            <ExperienceController LvL={Level} XP={XP} MaxXP={Level*3} />
                        </IonCol> 
                    </IonRow>
                    {isPlatform('desktop') && (
                    <IonGrid class='MainGrid-desktop'>
                        <IonRow class='ion-justify-content-center'>
                            <IonCol class='blurred-box'>

                                <IonRow class='ion-justify-content-center'>

                                    <IonLabel>Here is Today Summary</IonLabel>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonRow>
                                           <IonText>Task Succeed : {TaskSuccessToday}</IonText> 
                                        </IonRow>
                                        <IonRow>
                                            <IonText> Task Succeed Below 1 Hour : {TaskEasyDone}</IonText>  
                                        </IonRow>
                                        <IonRow>
                                            <IonText> Task Succeed Between 1-2 Hour : {TaskMedDone}</IonText>  
                                        </IonRow>
                                        <IonRow>
                                            <IonText>Task Succeed Between 2-4 Hour : {TaskHardDone} </IonText> 
                                        </IonRow>
                                        <IonRow>
                                            <IonText>Task Succeed Above 6 Hour : {TaskVHardDone} </IonText> 
                                        </IonRow>
                                    </IonCol>
                                    <IonCol>
                                        <IonRow>
                                            Task Failed  :  {TaskFailedToday}
                                        </IonRow>
                                        <IonRow>
                                            <IonText> Task Failed Below 1 Hour : {TaskFEasyDone}</IonText>  
                                        </IonRow>
                                        <IonRow>
                                            <IonText> Task Failed Between 1-2 Hour : {TaskFMedDone}</IonText>  
                                        </IonRow>
                                        <IonRow>
                                            <IonText>Task Failed Between 2-4 Hour : {TaskFHardDone} </IonText> 
                                        </IonRow>
                                        <IonRow>
                                            <IonText>Task Failed Above 6 Hour : {TaskFVHardDone} </IonText> 
                                        </IonRow>
                                    </IonCol>
                                </IonRow>

                            </IonCol>
                        </IonRow>


                        <IonRow >
                            <IonCol class='blurred-box'>
                                <IonRow class='ion-justify-content-center'>
                                    <IonLabel>Details of Task Succeed Today </IonLabel>
                                </IonRow>
                                <IonRow class='ion-justify-content-center'>
                                    <IonCol>
                                        <IonList class='List-backtrans'>
                                            {DataSuccess.map((item)=>(
                                                <IonItem key={item.key} class='Field3-mobile'>
                                                    <IonCol>
                                                        <IonRow>
                                                            <IonText class='Font-Judul'>
                                                                {item.TaskName}
                                                            </IonText>
                                                        </IonRow>
                                                        <IonRow>
                                                            <IonText class='Font-Desktop'> {item.Keterangan} </IonText>
                                                        </IonRow>
                                                        <IonRow>
                                                            { item.tags.Class  && (
                                                                    <IonText class='Font-Desktop'>Class. </IonText>
                                                            )}
                                                            { item.tags.Study  && (
                                                                    <IonText class='Font-Desktop'>Study. </IonText>                                                    
                                                            )}
                                                            { item.tags.HomeWork && (
                                                                    <IonText class='Font-Desktop'>HomeWork. </IonText>
                                                            )}
                                                            { item.tags.Test  && (
                                                                    <IonText class='Font-Desktop'>Test. </IonText>
                                                            )}
                                                        </IonRow>
                                                        <IonRow>
                                                            <IonText class='Font-Desktop'>{secondsToTime(item.Timer)} </IonText>
                                                        </IonRow>
                                                    </IonCol>
                                                </IonItem>
                                            )
                                            )}
                                        </IonList>
                                    </IonCol>
                                </IonRow>
                            </IonCol>
                            <IonCol class='blurred-box'>
                                <IonRow class='ion-justify-content-center'>
                                    <IonLabel>Details Of Task Failed Today </IonLabel>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonList class='List-backtrans'>
                                            {DataFailed.map((item)=>(
                                                <IonItem key={item.key} class='Field3-mobile'>
                                                    <IonCol>
                                                        <IonRow>
                                                            <IonText class='Font-Judul'>
                                                                {item.TaskName}
                                                            </IonText>
                                                        </IonRow>
                                                        <IonRow>
                                                            <IonText class='Font-Desktop'>{item.Keterangan} </IonText>
                                                        </IonRow>
                                                        <IonRow>
                                                        { item.tags.Class  && (
                                                                    <IonText class='Font-Desktop'>Class. </IonText>
                                                            )}
                                                            { item.tags.Study  && (
                                                                    <IonText class='Font-Desktop'>Study. </IonText>                                                    
                                                            )}
                                                            { item.tags.HomeWork && (
                                                                    <IonText class='Font-Desktop'>HomeWork. </IonText>
                                                            )}
                                                            { item.tags.Test  && (
                                                                    <IonText class='Font-Desktop'>Test. </IonText>
                                                            )}
                                                        </IonRow>
                                                        <IonRow>
                                                            <IonText class='Font-Desktop'>{secondsToTime(item.Timer)} </IonText>
                                                        </IonRow>
                                                    </IonCol>
                                                </IonItem>
                                            )
                                            )}
                                        </IonList>
                                    </IonCol>
                                </IonRow>
                                
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    )}
                    {isPlatform('mobile') && (
                    <IonGrid class='MainGrid-Mobile'>
                        <IonRow class='ion-justify-content-center'>
                            <IonCol>

                                <IonRow class='ion-justify-content-center'>

                                    Here is Today Summary
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonRow>
                                            Task Succeed : {TaskSuccessToday}
                                        </IonRow>
                                        <IonRow>
                                            Below 1 Hour : {TaskEasyDone}
                                        </IonRow>
                                        <IonRow>
                                            Between 1-2 Hour : {TaskMedDone}
                                        </IonRow>
                                        <IonRow>
                                            Between 2-4 Hour : {TaskHardDone}
                                        </IonRow>
                                        <IonRow>
                                            Above 6 Hour : {TaskVHardDone}
                                        </IonRow>
                                    </IonCol>   
                                    <IonCol>
                                        <IonRow>
                                            Task Failed  :  {TaskFailedToday}
                                        </IonRow>
                                        <IonRow>
                                            <IonText> Below 1 Hour : {TaskFEasyDone}</IonText>  
                                        </IonRow>
                                        <IonRow>
                                            <IonText> Between 1-2 Hour : {TaskFMedDone}</IonText>  
                                        </IonRow>
                                        <IonRow>
                                            <IonText> Between 2-4 Hour : {TaskFHardDone} </IonText> 
                                        </IonRow>
                                        <IonRow>
                                            <IonText> Above 6 Hour : {TaskFVHardDone} </IonText> 
                                        </IonRow>
                                    </IonCol>
                                </IonRow>

                            </IonCol>
                        </IonRow>
                        <IonRow >
                            <IonCol class='blurred-box'>
                                <IonRow class='ion-justify-content-center'>
                                    <IonLabel>Task Succeed Today </IonLabel>
                                </IonRow>
                                <IonRow class='ion-justify-content-center'>
                                    <IonCol>
                                        <IonList class='List-backtrans'>
                                            {DataSuccess.map((item)=>(
                                                <IonItem key={item.key} class='Field3-mobile'>
                                                    <IonCol>
                                                        <IonRow>
                                                            <IonText class='Font-Judul'>
                                                                {item.TaskName}
                                                            </IonText>
                                                        </IonRow>
                                                        <IonRow>
                                                            <IonText class='Font-Desktop'> {item.Keterangan} </IonText>
                                                        </IonRow>
                                                        <IonRow>
                                                        { item.tags.Class  && (
                                                                    <IonText class='Font-Desktop'>Class. </IonText>
                                                            )}
                                                            { item.tags.Study  && (
                                                                    <IonText class='Font-Desktop'>Study. </IonText>                                                    
                                                            )}
                                                            { item.tags.HomeWork && (
                                                                    <IonText class='Font-Desktop'>HomeWork. </IonText>
                                                            )}
                                                            { item.tags.Test  && (
                                                                    <IonText class='Font-Desktop'>Test. </IonText>
                                                            )}
                                                        </IonRow>
                                                        <IonRow>
                                                            <IonText class='Font-Desktop'>Waktu : {secondsToTime(item.Timer)} </IonText>
                                                        </IonRow>
                                                    </IonCol>
                                                </IonItem>
                                            )
                                            )}
                                        </IonList>
                                    </IonCol>
                                </IonRow>
                            </IonCol>
                            <IonCol class='blurred-box'>
                                <IonRow class='ion-justify-content-center'>
                                    <IonLabel>Task Failed Today </IonLabel>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonList class='List-backtrans'>
                                            {DataFailed.map((item)=>(
                                                <IonItem key={item.key} class='Field3-mobile'>
                                                    <IonCol>
                                                        <IonRow>
                                                            <IonText class='Font-Judul'>
                                                                {item.TaskName}
                                                            </IonText>
                                                        </IonRow>
                                                        <IonRow>
                                                            <IonText class='Font-Desktop'> {item.Keterangan} </IonText>
                                                        </IonRow>
                                                        <IonRow>
                                                        { item.tags.Class  && (
                                                                    <IonText class='Font-Desktop'>Class. </IonText>
                                                            )}
                                                            { item.tags.Study  && (
                                                                    <IonText class='Font-Desktop'>Study. </IonText>                                                    
                                                            )}
                                                            { item.tags.HomeWork && (
                                                                    <IonText class='Font-Desktop'>HomeWork. </IonText>
                                                            )}
                                                            { item.tags.Test  && (
                                                                    <IonText class='Font-Desktop'>Test. </IonText>
                                                            )}
                                                        </IonRow>
                                                        <IonRow>
                                                        <IonText class='Font-Desktop'>Waktu : {secondsToTime(item.Timer)} </IonText>
                                                        </IonRow>
                                                    </IonCol>
                                                </IonItem>
                                            )
                                            )}
                                        </IonList>
                                    </IonCol>
                                </IonRow>
                                
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    )}

                    


                </IonGrid>

                <IonLoading
                    isOpen={showLoading}
                    onDidDismiss={() => setShowLoading(false)}
                    message={'Loading...'}
                />
            </IonContent>
        </IonPage>
        
        );
    }

    export default TodayWorks;