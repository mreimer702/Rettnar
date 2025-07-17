import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Renttar',
      choose: 'Choose how you\'d like to continue',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      forgotPassword: 'Forgot Password?',
      guest: 'Continue as Guest',
      welcomeBack: 'Welcome Back',
      signInSubtitle: 'Sign in to your Renttar account',
      emailLabel: 'Email',
      emailPlaceholder: 'Enter your email',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      forgotPassword: 'Forgot Password?',
      signingIn: 'Signing In...',
      noAccount: "Don't have an account?",
      createAccount: 'Create Account',
      joinRenttar: 'Join Renttar and start renting today',
      firstName: 'First Name',
      lastName: 'Last Name',
      enterEmailPlaceholder: 'john.doe@example.com',
      createPasswordPlaceholder: 'Create a password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your password',
      creatingAccount: 'Creating Account...',
      alreadyHaveAccount: 'Already have an account?',
      placeholderFirstName: 'John',
      placeholderLastName: 'Doe',
    },
  },
  fr: {
    translation: {
      welcome: 'Bienvenue à Renttar',
      choose: 'Choisissez comment vous souhaitez continuer',
      signIn: 'Se connecter',
      signUp: 'S\'inscrire',
      forgotPassword: 'Mot de passe oublié ?',
      guest: 'Continuer en tant qu\'invité',
      welcomeBack: 'Bon retour',
      signInSubtitle: 'Connectez-vous à votre compte Renttar',
      emailLabel: 'E-mail',
      emailPlaceholder: 'Entrez votre e-mail',
      passwordLabel: 'Mot de passe',
      passwordPlaceholder: 'Entrez votre mot de passe',
      forgotPassword: 'Mot de passe oublié ?',
      signingIn: 'Connexion...',
      noAccount: "Vous n'avez pas de compte ?",
      createAccount: 'Créer un compte',
      joinRenttar: 'Rejoignez Renttar et commencez à louer dès aujourd\'hui',
      firstName: 'Prénom',
      lastName: 'Nom de famille',
      enterEmailPlaceholder: 'jean.dupont@exemple.com',
      createPasswordPlaceholder: 'Créez un mot de passe',
      confirmPassword: 'Confirmez le mot de passe',
      confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
      creatingAccount: 'Création du compte...',
      alreadyHaveAccount: 'Vous avez déjà un compte ?',
      placeholderFirstName: 'Jean',
      placeholderLastName: 'DuPont',
    },
  },
};

const fallbackLocale = 'en'; 
const detectedLocale = Localization.locale || fallbackLocale; 

i18n.use(initReactI18next).init({
  resources,
  lng: detectedLocale.startsWith('fr') ? 'fr' : 'en', 
  fallbackLng: fallbackLocale,
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;

