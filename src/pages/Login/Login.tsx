import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol
, IonInput, IonItem, IonLabel, IonButton, IonCard, IonImg, IonAlert, IonText, IonGrid, isPlatform } from '@ionic/react';
import { IonIcon } from '@ionic/react';
import { logoGoogle } from "ionicons/icons";
import "./Login.css";
import { useHistory } from 'react-router';
import { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider,signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth"
import { getDatabase, ref, child, get, set, query, orderByChild, equalTo, onValue } from "firebase/database";

import MainIcon from '../../components/Image/Icon.png'

const Login: React.FC = () => {
    const auth = getAuth();
    const history = useHistory();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [ErrorMessage, SetErrorMessage]=useState('')
    const [ErrorCode, SetErrorCode]=useState('')
    const [showAlert1, setShowAlert1] = useState(false);

    console.log('Opening Login')

    async function LoginGoogle() {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then((result) => { 
            const userID = result.user.uid;
            const userName = result.user.displayName;
            const UserEmail = result.user.email;
            console.log('user ID :',userID)
            console.log('user userName :',userName)
            console.log('user UserEmail :',UserEmail)

            get(child(ref(getDatabase()), 'users/'+userID))
            .then((snapshot) => {
                if (snapshot.exists()) {
                //   console.log(snapshot.val());
                    console.log('login success redirect to Schedule')
                    history.push("/Timer")
                } else {
                    console.log("No data available");

                        set(ref(getDatabase(), 'users/' +   userID), {
                        username: userName,
                        email: UserEmail,
                        Level: 1,
                        XP :0, 
                        TaskDone :0,
                        TaskDoneQuickly :0,
                        TaskStudyDone :0,
                        TaskTestDone:0,
                        TaskClassDone:0,
                        TaskHomeWorkDone:0,
                        EasyTaskDone:0,
                        MedTaskDone:0,
                        HardTaskDone:0,
                        VHardTaskDone:0,    
                        SummonTicket :1,
                        FieldTicket :1,
                        SummonPulled:0,
                        FieldClaimed:0,
                        FirstLogin:true
                    })



                    // console.log('login success redirect to tutorial')
                    // history.push("/Tutorial")
                }
            }).catch((error) => {
                console.error(error);
              })

        }).catch((error) => {
            console.log('login gagal')
            console.log('error :',error)
        });
        // const user = auth.currentUser;  
    }

    async function loginUser(email:string, password:string){
            const res =  await signInWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                console.log('Error code :',error.code)
                console.log('Error Message :',error.message)
                SetErrorCode(error.message);
                SetErrorMessage(error.message);
            });
            // const user = auth.currentUser;            
            // console.log('user : ',user)
            // console.log(res,'res')
            // const dbRef = ref(getDatabase());

            // if(user){
            //     get(child(dbRef, 'users/' + user.uid)).then((snapshot) => {
            //         if (snapshot.exists()) {
            //           if(snapshot.val().FirstLogin == true){
            //             history.push("/Tutorial")
            //           }else{
            //             history.push("/Schedule")
            //           }
            //         } else {
            //           console.log("No data available");
            //         }
            //       }).catch((error) => {
            //         console.error(error);
            //       });
            // }


            return res
    }

    async function login() {
        const res = await loginUser(email, password)
         console.log(`${res ? 'login success' : 'login failed'}`)
        if (res)
        {
            // history.push("/Schedule")
            console.log('success')    
        } 
        else 
        (
            setShowAlert1(true)
        )
    }

    async function Register() {
        history.push("/Register")
    }

    onAuthStateChanged(auth, (user) => {
        // history.push("/Tutorial")
        if (user) {
        console.log('onAuthStateChanged')
        //   history.push('/Schedule');
          const user = auth.currentUser;            
        //   console.log('user : ',user)
          const dbRef = ref(getDatabase());
        //   console.log('User :',user)
          if(user){
              get(child(dbRef, 'users/' + user.uid)).then((snapshot) => {
                  if (snapshot.exists()) {
                    console.log(snapshot.val())
                    if(snapshot.val().FirstLogin == true){
                        console.log("Going to Tutorial")
                      history.push('/Tutorial')
                    }else{
                        console.log("Going to Timer")
                      history.push("/Timer")
                    }
                  } else {
                    console.log("No data available");
                  }
                }).catch((error) => {
                  console.error(error);
                });
          }
        } 
      });

    if(isPlatform('mobile')){
        return(
        <IonPage>
            <IonContent fullscreen class='LoginandRegis'>
                <IonGrid style={{ height: "100%" }}>
                    <IonRow class="ion-align-items-center"  style={{ height: "100%" }}>
                        <IonCol>
                            <IonRow style={{ height: "100%" }}>
                                <IonCol class='ion-text-center'>
                                    <IonRow class='ion-justify-content-center'>
                                        <IonImg
                                            class='Main-Icon'
                                            src={MainIcon}>
                                        </IonImg>
                                    </IonRow>
                                </IonCol>
                            </IonRow>
                            <IonRow class="ion-justify-content-center">
                                <IonCol>
                                    <IonItem class='ItemsMobile'>
                                        <IonLabel position="floating"> Email</IonLabel>
                                        <IonInput
                                            id="login-email"
                                            type="email"
                                            placeholder="Input Email"
                                            onIonChange={(e: any) => setEmail(e.target.value)}
                                            >
                                        </IonInput>
                                    </IonItem>
                                    <IonItem class='ItemsMobile'>
                                        <IonLabel position="floating"> Password</IonLabel>
                                        <IonInput
                                            //   onIonInput={(e: any) => setPassword(e.target.value)}
                                            id="login-password"
                                            type="password"
                                            placeholder="Input password"
                                            onIonChange={(e: any) => setPassword(e.target.value)}
                                        />
                                    </IonItem > 
                                    <IonLabel class="to-registerMobile">
                                            Don't have an account? <a href="Register">Register Here</a>
                                    </IonLabel>
                                
                                    <IonRow>
                                        <IonCol class='ion-text-center'>

                                            <IonButton className="button1" onClick={login}  class="button">
                                                Sign In
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>           
                                    {/* <IonRow>
                                        <IonCol class='ion-text-center'>
                                            <IonButton className="button1" onClick={Register}  class="button">
                                                Register
                                            </IonButton>
                                        </IonCol>
                                    </IonRow> */}
                                    <IonRow >
                                        <IonCol class='ion-text-center'>
                                            <IonButton className="button1" onClick={LoginGoogle}  class="button">
                                                <IonRow class="ion-align-items-center">
                                                    <IonCol>
                                                        <IonIcon icon={logoGoogle} size='large'/> 
                                                    </IonCol>
                                                    <IonCol>
                                                        <IonText>Google Login</IonText>
                                                    </IonCol>
                                                    {/* <IonCol>
                                                        <IonText>Google</IonText>
                                                    </IonCol> */}
                                                </IonRow>
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>

                                </IonCol>
                            </IonRow>
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
                </IonGrid>
            </IonContent>
        </IonPage>
        )
    }
    else {
        return (
            <IonPage>
                {/* <IonHeader>
                    <IonToolbar>
                        <IonTitle>Login Page</IonTitle>
                    </IonToolbar>
                </IonHeader> */}
                <IonContent fullscreen class='LoginandRegis'>
                    <IonGrid >
                    
                    <IonRow >
                        <IonCol class='ion-text-center'>
                            <IonRow class='ion-justify-content-center'>
                                <IonImg
                                    class='Main-Icon'
                                    src={MainIcon}>
            
                                    </IonImg>
                            </IonRow>
            
                        </IonCol>
                    </IonRow>
                    <IonRow class="ion-justify-content-center">
                        <IonCol size='8'>
                            <IonItem className='RoundedItems'>
                                <IonLabel position="floating"> Email</IonLabel>
                                <IonInput
                                    id="login-email"
                                    type="email"
                                    placeholder="Input Email"
                                    onIonChange={(e: any) => setEmail(e.target.value)}
                                    >
                                </IonInput>
                            </IonItem>
                            <IonItem className='RoundedItems'>
                                <IonLabel position="floating"> Password</IonLabel>
                                <IonInput
                                    //   onIonInput={(e: any) => setPassword(e.target.value)}
                                    id="login-password"
                                    type="password"
                                    placeholder="Input password"
                                    onIonChange={(e: any) => setPassword(e.target.value)}
                                >
            
                                </IonInput>
                            </IonItem >
                            <IonLabel class="to-register">
                                    Don't have an account? <a href="Register">Register Here</a>
                                 </IonLabel> 
                            <IonRow>
                                <IonCol class='ion-text-center'>
                                    <IonButton className="button1" onClick={login}  class="button">
                                        Login
                                    </IonButton>
                                </IonCol>
                            </IonRow>
            
                            {/* <IonRow>
                                <IonCol class='ion-text-center'>
                                    <IonButton className="button1" onClick={Register}  class="button">
                                        Register
                                    </IonButton>
                                </IonCol>
                            </IonRow> */}
                            <IonRow>
                                <IonCol class='ion-text-center'>
                                    <IonButton className="button1" onClick={LoginGoogle}  class="button">
                                        <IonRow class="ion-align-items-center">
                                            <IonCol>
                                                <IonIcon icon={logoGoogle} size='large'/> 
                                            </IonCol>
                                            <IonCol>
                                                <IonText>Google Login</IonText>
                                            </IonCol>
                                            {/* <IonCol>
                                                <IonText>Google</IonText>
                                            </IonCol> */}
                                        </IonRow>
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonCol>
                    </IonRow>
                    {/* <IonRow>
                        <IonCol class='ion-text-center'>
                            <IonButton className="button1" onClick={LoginGoogle}  class="button">
                                <IonRow class="ion-align-items-center">
                                    <IonCol>
                                        <IonIcon icon={logoGoogle} size='large'/> 
                                    </IonCol>
                                    <IonCol>
                                        <IonText>Google Login</IonText>
                                    </IonCol>
                                </IonRow>
                            </IonButton>
                        </IonCol>
                    </IonRow> */}
            
                    <IonAlert
                      isOpen={showAlert1}
                      onDidDismiss={() => setShowAlert1(false)}
                      cssClass='my-custom-class'
                      header={ErrorCode}
                      message={ErrorMessage}
                      buttons={['OK']}
                    />
                </IonGrid>
                </IonContent>
            </IonPage>
        );
    }

  };
  
  export default Login;

