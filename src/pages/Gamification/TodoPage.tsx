import { IonContent, IonPage, IonRow, IonCol, IonText, IonRange, IonAlert
    , IonInput, IonItem, IonLabel,  IonFab, IonFabButton, IonModal, IonButton, IonChip, isPlatform, IonToolbar, IonGrid, IonRadioGroup, IonRadio} from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { add, bookSharp, schoolSharp ,documentsSharp , clipboard, closeCircle, timer} from "ionicons/icons";
import React, { useEffect, useState} from 'react';

import { useHistory } from 'react-router';

import { getDatabase, ref, onValue, set, push, child, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import ProfilePicture from '../Controller/ProfilePicture'
import LevelController from '../Controller/LevelController'
import ExperienceController from '../Controller/ExperienceController';
import TodoList2 from './TodoList';

import './TodoPage.css'

const Todo: React.FC = () => {
    //console.log('todopage')
    const [ProfilePhotoURL, SetProfilePhotoURL] = useState<string | any>()
    const [Username, SetUsername] = useState<string | any>()
    const [UID,SetUID] = useState<string | any>()

    const [Level, SetLevel] = useState<Number | any>()
    const [XP, SetXP] = useState<Number| any>()
    const [showModalTodo, setShowModalTodo] = useState(false);
    const [showAlert1, setShowAlert1] = useState(false);
    const [ErrorMessage, SetErrorMessage]=useState('')
    const [ErrorCode, SetErrorCode]=useState('')


    // const formatDate = (value: string) => {
    //     return format(parseISO(value), 'dd MMM yyyy');
    //   };

    const [Jam ,SetJam ]=useState<number>(0);
    const [Menit ,SetMenit ]=useState<number>(0);
    const [Detik ,SetDetik ]=useState<number>(0);

    const[Taskname,SetTaskName] =useState<string>()
    const[Keterangan,SetKeterangan] =useState<string>()
    const[Difficulty,SetDiffculty]=useState<number>(1)
    // const[DueDate,SetDuedate]=useState('')
    // const[DueDateBackend,SetDuedateBackend]=useState('')
    // const[Importance,SetImportance]=useState<number>(1)
    const[StudyState,SetStudyState]=useState<Boolean>(false)
    const[ClassState,SetClassState]=useState<Boolean>(false)
    const[HomeWorkState,SetHomeWorkState]=useState<Boolean>(false)
    const[TestState,SetTestState]=useState<Boolean>(false)

    const[StrTimer,SetStrTimer]=useState<number>(0)

    const [popoverDate2, setPopoverDate2] = useState('');

    // const backendDateSaving=(ValueDate : Date)=>{
    //     setPopoverDate2(ValueDate)
    // }

    const getUserPhotoURLname= async (photoURL2: string | null,username : string | null)=>{
        SetProfilePhotoURL(photoURL2);
        SetUsername(username);
    }

    function secondsToTime(e: number){
        const h = Math.floor(e / 3600).toString().padStart(2,'0'),
              m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
              s = Math.floor(e % 60).toString().padStart(2,'0');
        
        return h + ':' + m + ':' + s;
        //return `${h}:${m}:${s}`;
    }

    const getUserData= async (uid: string)=>{
        const ref1 = ref(db, 'users/' + uid );
        onValue(ref1, (snapshot) => {
            const data = snapshot.val();
            //console.log('level :',data.Level);
            SetLevel(data.Level)
            //console.log('XP :',data.XP);
            SetXP(data.XP)

          });
    }

    // LEON
    const history = useHistory();
    const auth = getAuth();
    const db = getDatabase();
    //console.log('db :',db)



        onAuthStateChanged(auth, (user) => {
            if (user) {
              //console.log('User :',user)
              const uid = user.uid;
              //console.log('UID :',UID)
              const UserPhotoURL=user.photoURL;
              const username=user.displayName
              SetUID(uid);
              getUserData(uid);
              getUserPhotoURLname(UserPhotoURL,username);
              
            } else {
                history.push('/login');
            }
              });


    async function AddTodoList(uid: string){
        if(!Taskname)
        {
            SetErrorCode('Name is Empty');
            SetErrorMessage('Name Field Is Required.');
            return false
        }
        else if(!Keterangan)
        {
            SetErrorCode('Keterangan is Empty');
            SetErrorMessage('Keterangan Field Is Required.');
            return false
        // }
        // else if(!DueDate)
        // {
        //     SetErrorCode('DueDate is Empty');
        //     SetErrorMessage('DueDate Field Is Required.');
        //     return false
        }else if(StrTimer==0){
            SetErrorCode('Waktu tidak boleh kosong ');
            SetErrorMessage('Time Field Is Required.');
            return false
        }else{
            const newPostKey = push(child(ref(db), 'Schedule/'+uid)).key;
            const postData = {
                TaskName: Taskname,
                Keterangan: Keterangan,
                Difficulty: Difficulty,
                //DueDate : DueDate,
                //Importance : Importance,
                Timer: StrTimer,
                tags :{
                    Study      : StudyState,
                    HomeWork   : HomeWorkState,
                    Test       : TestState,
                    Class      : ClassState
                },
                //StatusBerhasil :false,
                //StatusGagal :false,
                StatusApproved :false,
                StatusMulai :false,
                StatusSelesai:false,
                InUse : false
              };
            console.log('data :',postData)
            const res1 = await update(ref(db,'/Schedule/' + uid + '/' + newPostKey), postData).then(() => {
                // Data saved successfully!
                return true
              })
              .catch((error) => {
                // The write failed...
                console.log('Error code :',error.code)
                console.log('Error Message :',error.message)
                SetErrorCode(error.message);
                SetErrorMessage(error.message);
                return false
              });
            return res1
        }
    }    

    function SetTimer(DiffVal : number){
        SetStrTimer(DiffVal)
        console.log(StrTimer);
    }

    function SetHour2 (DiffVal : number){
        SetJam(DiffVal)
        console.log(StrTimer);
    }

    function SetMinute2 (DiffVal : number){
        SetMenit(DiffVal)
        console.log(StrTimer);
    }

    function SetDetik2 (DiffVal : number){
        SetDetik(DiffVal)
        console.log(StrTimer);
    }

    function SetDiff2 (DiffVal : number){
        if(DiffVal <=3600)
        {
            SetDiffculty(1)
            console.log('Difficulty',Difficulty);
        }else if (DiffVal <=7200){
            SetDiffculty(2)
            console.log('Difficulty',Difficulty);
        }else if (DiffVal <=14400){
            SetDiffculty(3)
            console.log('Difficulty',Difficulty);
        }else{
            SetDiffculty(4)
            console.log('Difficulty',Difficulty);
        }
    }

    async function SetHour(Hour: number ){
        console.log('jam :',Hour);
        SetHour2(Hour)
        SetTimer(Hour*3600 + Menit*60+Detik*1)
        SetDiff2(Hour*3600 + Menit*60+Detik*1)
        // console.log('Jam Bo+ menit + Detik :',Jam,' + ', Menit ,' + ',Detik)

        // if(Jam*3600 + Menit*60 + Detik*1 <=3600)
        // {
        //     SetDiffculty(1)
        //     console.log('Difficulty',Difficulty);
        // }else if (Jam*3600 + Menit*60 + Detik*1 <=7200){
        //     SetDiffculty(2)
        //     console.log('Difficulty',Difficulty);
        // }else if (Jam*3600 + Menit*60 + Detik*1 <=14400){
        //     SetDiffculty(3)
        //     console.log('Difficulty',Difficulty);
        // }else{
        //     SetDiffculty(4)
        //     console.log('Difficulty',Difficulty);
        // }


        // if(Diffval==1){
        //     SetTimer(900)
        // }else if(Diffval==2){
        //     SetTimer(1800)
        // }else if(Diffval==3){
        //     SetTimer(2700)
        // }else if(Diffval==4){
        //     SetTimer(3600)
        // }
    }

    async function SetMinute(Minute: number ){
        console.log('menit :',Minute);
        if (Minute>60){
            SetMinute2(60)
            
            SetTimer(Jam*3600 + 60*60+Detik*1)
            SetDiff2(Jam*3600 + 60*60 + Detik*1)

        }else{
            SetMinute2(Minute)
            // console.log('Jam + menit Bo + Detik :',Jam,' + ', Menit ,' + ',Detik)
            SetTimer(Jam*3600 + Minute*60+Detik*1)
            SetDiff2(Jam*3600 + Minute*60+Detik*1)
        }

        // console.log('Jam + menit Bo + Detik :',Jam,' + ', Menit ,' + ',Detik)
        

        // if(Jam*3600 + Menit*60 + Detik*1 <=3600)
        // {
        //     SetDiffculty(1)
        //     console.log('Difficulty',Difficulty);
        // }else if (Jam*3600 + Menit*60 + Detik*1 <=7200){
        //     SetDiffculty(2)
        //     console.log('Difficulty',Difficulty);
        // }else if (Jam*3600 + Menit*60 + Detik*1 <=14400){
        //     SetDiffculty(3)
        //     console.log('Difficulty',Difficulty);
        // }else{
        //     SetDiffculty(4)
        //     console.log('Difficulty',Difficulty);
        // }


        // if(Diffval==1){
        //     SetTimer(900)
        // }else if(Diffval==2){
        //     SetTimer(1800)
        // }else if(Diffval==3){
        //     SetTimer(2700)
        // }else if(Diffval==4){
        //     SetTimer(3600)
        // }
    }


    async function SetSecs(Secs: number ){
        console.log('Secs :',Secs);
        if(Secs>60){
            SetDetik2(60)
            
            SetTimer(Jam*3600 + Menit*60 + 60*1)
            SetDiff2(Jam*3600 + Menit*60 + 60*1)
        }else {
            // console.log('Jam + menit + Detik Bo:',Jam,' + ', Menit ,' + ',Detik)
            SetDetik2(Secs)
            SetTimer(Jam*3600 + Menit*60 + Secs*1)
            SetDiff2(Jam*3600 + Menit*60 + Secs*1)
        }

        // console.log('Jam + menit + Detik Bo:',Jam,' + ', Menit ,' + ',Detik)

        // if(Jam*3600 + Menit*60 + Detik*1 <=3600)
        // {
        //     SetDiffculty(1)
        //     console.log('Difficulty',Difficulty);
        // }else if (Jam*3600 + Menit*60 + Detik*1 <=7200){
        //     SetDiffculty(2)
        //     console.log('Difficulty',Difficulty);
        // }else if (Jam*3600 + Menit*60 + Detik*1 <=14400){
        //     SetDiffculty(3)
        //     console.log('Difficulty',Difficulty);
        // }else{
        //     SetDiffculty(4)
        //     console.log('Difficulty',Difficulty);
        // }

        // if(Diffval==1){
        //     SetTimer(900)
        // }else if(Diffval==2){
        //     SetTimer(1800)
        // }else if(Diffval==3){
        //     SetTimer(2700)
        // }else if(Diffval==4){
        //     SetTimer(3600)
        // }
    }



    async function ChangeDiff(Diffval: number ){
        console.log('Diff :',Diffval);
        SetDiffculty(Diffval);
        if(Diffval==1){
            SetTimer(900)
        }else if(Diffval==2){
            SetTimer(1800)
        }else if(Diffval==3){
            SetTimer(2700)
        }else if(Diffval==4){
            SetTimer(3600)
        }
    }

    async function AddTodoList1() {
        const res = await AddTodoList(UID)
        console.log(`${res ? 'Register success' : 'Register failed'}`)
        if (res)
        {
            setShowModalTodo(false)
        } 
        else 
        {
            setShowAlert1(true);
        }
    }
    async function changestatus(status :Boolean){
        //console.log('Current Status :',status)
        if (status == true)
        {   
            //console.log('returned false')
            return false
        }
        else{
            //console.log('returned true')
            return true 
        } 
    }

    const OpenModal=()=>{
        console.log('setting Nilai aawal Modal')
        SetTaskName('')
        SetKeterangan('')
        //SetDiffculty(1)
        SetJam(0)
        SetMenit(0)
        SetDetik(0)
        // SetDuedate('')
        setPopoverDate2('')
        // SetImportance(1)
        SetStudyState(false)
        SetClassState(false)
        SetHomeWorkState(false)
        SetTestState(false)
        setShowModalTodo(true)
        SetTimer(0)
    }
    
    useEffect(() => {
        console.log('Jam + menit Bo + Detik :',Jam,' + ', Menit ,' + ',Detik)
        console.log('Difficulty :',Difficulty)
        // console.log('the Jam has changed', Jam)
     }, [Jam,Menit,Detik,Difficulty])

    // useEffect(() => {
        
    //     console.log('the Jam has changed', Jam)
    //  }, [Jam])
    //  useEffect(() => {
    //     console.log('the Menit has changed', Menit)
    //  }, [Menit])
    //  useEffect(() => {
    //     console.log('the Detik has changed', Detik)
    //  }, [Detik])
    //  useEffect(() => {
    //     console.log('the Time has changed', StrTimer)
    //  }, [StrTimer])

     

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
            <IonRow>
                <h6>*Swipe Right of left to decide success or not </h6>
            </IonRow>
            <IonRow class="ion-align-items-center">
                <IonCol>
                    <TodoList2 UID={UID} />
                </IonCol>
            
            </IonRow>
        </IonGrid>

        <IonFab slot="fixed"  vertical="bottom" horizontal="end"  id="trigger-button-formtodo" onClick={OpenModal}>
            <IonFabButton id='Add-Todolist'>
                <IonIcon src={add}/>
            </IonFabButton>
        </IonFab>

        <IonModal trigger="trigger-button-formtodo" isOpen={showModalTodo} showBackdrop={false}>
            <IonContent>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel class='Hello' position="floating"> Name : </IonLabel>
                            <IonInput
                                id="Input-name"
                                type="text"
                                placeholder="Input Task name"
                                onIonChange={(e: any) => SetTaskName(e.target.value)}
                                >
                            </IonInput>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel class='Hello' position="floating"> Keterangan : </IonLabel>
                            <IonInput
                                id="Input-keterangan"
                                type="text"
                                placeholder="Input Additional Information"
                                onIonChange={(e: any) => SetKeterangan(e.target.value)}
                                >
                            </IonInput>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonCol>
                                <IonRow>
                                    <IonLabel class='Hello' position="floating"> Jam : </IonLabel>
                                </IonRow>
                                <IonRow>
                                    <IonInput
                                            id="Input-keterangan"
                                            type="number"
                                            placeholder="0"
                                            maxlength={2}
                                            max={99}
                                            onIonChange={(e: any) => SetHour(e.target.value)}
                                            >
                                    </IonInput> 
                                </IonRow>
                            </IonCol>
                                {/* <IonRow>
                                    <IonRadioGroup value={Difficulty} onIonChange={e => ChangeDiff(e.detail.value)}>
                                        <IonRow>
                                            <IonCol>
                                                <IonItem>
                                                    <IonLabel>00:15:00</IonLabel>
                                                    <IonRadio slot="start" value="1" />
                                                </IonItem>

                                                <IonItem>
                                                    <IonLabel>00:30:00</IonLabel>
                                                    <IonRadio slot="start" value="2" />
                                                </IonItem>
                                            </IonCol>
                                            <IonCol>
                                                
                                            </IonCol>
                                        </IonRow>
                                    </IonRadioGroup>
                                </IonRow> */}
 

                            {/* <IonRange   min={1} max={4} step={1} value={Difficulty} snaps={true} 
                                        onIonChange={(e: any) => ChangeDiff (e.target.value)}/> */}

                        </IonItem>

                    </IonCol>
                    <IonCol>
                        <IonItem>
                            <IonCol>
                                <IonRow>
                                    <IonLabel class='Hello' position="floating"> Menit : </IonLabel>
                                </IonRow>
                                <IonRow>
                                    <IonInput
                                            id="Input-keterangan"
                                            type="number"
                                            placeholder="0"
                                            maxlength={2}
                                            max={60}
                                            onIonChange={(e: any) => SetMinute(e.target.value)}
                                            >
                                    </IonInput> 
                                </IonRow>
                            </IonCol>
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem>
                            <IonCol>
                                <IonRow>
                                        <IonLabel class='Hello' position="floating"> Detik : </IonLabel>
                                    </IonRow>
                                    <IonRow>
                                        <IonInput
                                                id="Input-keterangan"
                                                type="number"
                                                placeholder="0"
                                                maxlength={2}
                                                max={60}
                                                onIonChange={(e: any) => SetSecs(e.target.value)}
                                                >
                                        </IonInput> 
                                    </IonRow>
                            </IonCol>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel> Time to Complete : {secondsToTime(StrTimer)} </IonLabel>
                        </IonItem>
                    </IonCol>
                </IonRow>
                {/* <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonRow>
                                <IonCol size='6'>
                                    <IonLabel class='Hello' > DueDate : </IonLabel>
                                </IonCol>
                                <IonCol >
                                    <IonInput type='date' id="date-input-2" onIonChange={(e: any) => SetDuedate(e.target.value)}/>
                                </IonCol>
                            </IonRow> */}

                            
                            {/* <IonButton fill="clear" id="open-date-input-2">
                                <IonIcon icon={calendar} />
                            </IonButton>
                            <IonPopover trigger="open-date-input-2"  showBackdrop={false} dismissOnSelect={true}> 
                                <IonDatetime presentation="date"
                                    onIonChange={ev => setPopoverDate2(ev.detail.value!)} >
                                </IonDatetime>
                            </IonPopover> */}
                        {/* </IonItem>
                    </IonCol>

                </IonRow> */}
                {/* <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="floating"> Importance</IonLabel>
                            <IonRange min={1} max={10} step={1} value={Importance} ticks={true} snaps={true} onIonChange={(e: any) => SetImportance(e.target.value)}/>
                        </IonItem>
                    </IonCol>
                </IonRow> */}
                <IonRow>
                        <IonChip onClick={async ()=>SetStudyState( await changestatus(StudyState))} >
                            <IonIcon src={bookSharp}/>
                            <IonLabel>Study</IonLabel>
                            {StudyState &&(
                                    <IonIcon src={closeCircle} />
                            )}
                            
                        </IonChip>
                        <IonChip onClick={async ()=>SetClassState( await changestatus(ClassState))}>
                            <IonIcon src={schoolSharp}/>
                            <IonLabel>Class</IonLabel>
                            {ClassState && (
                                <IonIcon src={closeCircle} />
                            )}
                        </IonChip>
                        <IonChip onClick={async ()=>SetHomeWorkState( await changestatus(HomeWorkState))}>
                            <IonIcon src={clipboard}/>
                            <IonLabel>Homework</IonLabel>
                            {HomeWorkState && (
                                <IonIcon src={closeCircle} />
                            )}
                        </IonChip>
                        <IonChip onClick={async ()=>SetTestState( await changestatus(TestState))}>
                            <IonIcon src={documentsSharp}/>
                            <IonLabel>Test</IonLabel>
                            {TestState && (
                                <IonIcon src={closeCircle} />
                            )}
                        </IonChip>
                </IonRow>
                <IonRow>
                    <IonCol  class="ion-align-self-center" >
                        <IonButton onClick={AddTodoList1}> OK</IonButton>
                    </IonCol>
                    <IonCol  class="ion-align-self-center">
                        <IonButton onClick={() => setShowModalTodo(false)}> Cancel</IonButton>
                    </IonCol>
                </IonRow>
                <IonAlert
                    isOpen={showAlert1}
                    onDidDismiss={() => setShowAlert1(false)}
                    cssClass='my-custom-class'
                    header={ErrorCode}
                    message={ErrorMessage}
                    buttons={['OK']}
                />

            </IonContent>
        </IonModal>
    </IonContent>
</IonPage>

);

};
export default Todo;