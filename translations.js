// Clean translations and language switching script
const translations = {
  fr: {
    p1_doc_title: 'IntelliBuild – Smart Objects',
    login_doc_title: 'Connexion – IntelliBuild',
    register_doc_title: 'Inscription – IntelliBuild',

    brand: 'IntelliBuild',
    nav_home: 'Accueil',
    nav_features: 'Fonctionnalités',
    nav_about: 'À propos',
    nav_dashboard: 'Dashboard',
    nav_add: 'Ajouter',
    nav_objects: 'Objets',
    nav_locations: 'Localisations',
    nav_settings: 'Paramètres',
    btn_login: 'Connexion',
    btn_register: 'Inscription',

    title: 'Plateforme intelligente<br>de gestion d’objets connectés',
    subtitle: 'Une solution moderne pour décrire, gérer, sécuriser et rechercher les objets connectés dans un smart building.',
    start: 'Commencer',
    discover: 'Découvrir',

    feature1_title: 'Gestion',
    feature1_text: 'Ajouter, modifier et supprimer facilement vos objets connectés.',
    feature2_title: 'Sécurité',
    feature2_text: 'Contrôle d’accès, protection des données et surveillance intelligente.',
    feature3_title: 'Recherche',
    feature3_text: 'Recherche rapide par type, localisation ou état des objets.',

    search_objects: 'Rechercher un objet...',
    objects_all: 'Tous les objets',
    new_object: 'Nouvel objet',
    add_object_title: 'Ajouter un objet',
    add_object_sub: "Remplissez les informations de l'appareil",
    add_object_name: "Nom de l'objet",
    add_object_type: 'Type',
    add_object_location: 'Localisation',
    add_object_description: 'Description',
    add_object_status: 'Statut',
    status_available: 'Disponible',
    status_offline: 'Hors-ligne',
    btn_cancel: 'Annuler',
    btn_save: 'Enregistrer',
    table_name: 'Nom',
    table_type: 'Type',
    table_location: 'Localisation',
    table_status: 'Statut',
    stat_total: 'Total objets',
    stat_active: 'Actifs',
    stat_inactive: 'Inactifs',
    stat_locations: 'Localisations',
    stat_locations_suffix: 'salles uniques',
    zones_title: 'Zones détectées',
    zone_active: 'Zone active',
    account_title: 'Mon Compte',
    session_admin: 'Session Admin',
    session_desc: 'Connecté en tant que gestionnaire',
    server_status: 'Statut du Serveur',
    server_ok: 'Backend MongoDB : Opérationnel',
    logout: 'Déconnexion',
    forgot_password: 'Mot de passe oublié ?',
    ph_email: 'exemple@mail.com',
    ph_password: '••••••••',
    ph_confirm_password: '••••••••',
    ph_object_name: 'Ex: Lampe Bureau...',
    ph_object_location: 'Bureau 101',

    about_title: 'Pourquoi IntelliBuild ?',
    about_text: 'IntelliBuild centralise la gestion des objets connectés d’un bâtiment intelligent pour améliorer l’efficacité, la sécurité et la visibilité.',

    login_title: 'Connexion',
    login_sub: 'Accédez à votre plateforme de gestion d’objets connectés',
    label_email: 'Email',
    label_password: 'Mot de passe',
    btn_signin: 'Se connecter',
    auth_link_register: 'Pas encore de compte ? <a href="register.html">Créer un compte</a>',

    register_title: 'Créer un compte',
    register_sub: 'Rejoignez la plateforme IntelliBuild',
    label_fullname: 'Nom complet',
    label_confirm_password: 'Confirmer le mot de passe',
    btn_signup: 'S’inscrire',
    auth_link_login: 'Déjà un compte ? <a href="login.html">Se connecter</a>',

    // language names
    lang_fr: 'Français',
    lang_en: 'Anglais',
    lang_ar: 'العربية'
    ,
    // About page specific
    about_hero_title: 'Bienvenue sur IntelliBuild',
    about_hero_text: 'La solution intelligente pour gérer et optimiser les bâtiments modernes.',
    features_section_title: 'Nos Fonctionnalités',
    mission_title: 'Notre Mission',
    mission_text: 'Notre objectif est de simplifier la gestion des bâtiments intelligents tout en améliorant l’efficacité énergétique et la sécurité.',
    footer_text: '© 2026 InteliBuild - Tous droits réservés'
    ,
    // why-us section
    why1_title: 'Standard Web',
    why1_text: 'Basé sur W3C Thing Description et Schema.org.',
    why2_title: 'Interface intuitive',
    why2_text: 'Utilisation simple pour les utilisateurs non techniques.',
    why3_title: 'Architecture moderne',
    why3_text: 'FastAPI, MongoDB, Frontend web.',
    why4_title: 'Extensible',
    why4_text: 'Ajout facile de nouveaux types d’objets.',
    why5_title: 'Projet académique solide',
    why5_text: 'Conforme aux exigences PFE.',
    why6_title: 'Travail en équipe',
    why6_text: 'Développement collaboratif.',
    // stats
    stats1_label: 'Types d’objets',
    stats2_label: 'Objets simulés',
    stats3_label: 'Membres du groupe',

    nav_history: 'Historique',
    nav_role: 'Role',
    user_recent_objects: 'Objets recents',
    lang_title: 'Langue',
    lang_active: 'Langue active',
    menu_profile: 'Mon profil',
    detail_overlay_title: "Detail de l'objet",
    detail_name: 'Nom',
    detail_type: 'Type',
    detail_location: 'Localisation',
    detail_status: 'Statut',
    history_overlay_title: 'Historique utilisateur',
    history_date: 'Date',
    history_action: 'Action',
    history_detail: 'Detail',
    history_status: 'Statut',
    history_empty: 'Aucune action pour le moment.',
    role_overlay_title: 'Role utilisateur',
    role_user_chip: 'User',
    role_consultation_title: 'Consultation',
    role_consultation_text: 'Peut voir la liste des objets et le detail de chaque objet.',
    role_history_title: 'Historique',
    role_history_text: "Peut consulter son historique d'actions dans le dashboard.",
    role_settings_title: 'Parametres personnels',
    role_settings_text: "Peut changer sa langue d'affichage (FR, EN, AR).",
    status_active_label: 'Actif',
    status_inactive_label: 'Inactif'
  },
  en: {
    p1_doc_title: 'IntelliBuild – Smart Objects',
    login_doc_title: 'Login – IntelliBuild',
    register_doc_title: 'Register – IntelliBuild',

    brand: 'IntelliBuild',
    nav_home: 'Home',
    nav_features: 'Features',
    nav_about: 'About',
    nav_dashboard: 'Dashboard',
    nav_add: 'Add',
    nav_objects: 'Objects',
    nav_locations: 'Locations',
    nav_settings: 'Settings',
    btn_login: 'Login',
    btn_register: 'Sign Up',

    title: 'Smart connected objects management platform',
    subtitle: 'A modern solution for describing, managing, securing and searching connected objects in a smart building.',
    start: 'Get Started',
    discover: 'Discover',

    feature1_title: 'Management',
    feature1_text: 'Add, edit and remove your connected objects easily.',
    feature2_title: 'Security',
    feature2_text: 'Access control, data protection and intelligent monitoring.',
    feature3_title: 'Search',
    feature3_text: 'Fast search by type, location or object state.',

    search_objects: 'Search for an object...',
    objects_all: 'All objects',
    new_object: 'New object',
    add_object_title: 'Add an object',
    add_object_sub: 'Fill in the device information',
    add_object_name: 'Object name',
    add_object_type: 'Type',
    add_object_location: 'Location',
    add_object_description: 'Description',
    add_object_status: 'Status',
    status_available: 'Available',
    status_offline: 'Offline',
    btn_cancel: 'Cancel',
    btn_save: 'Save',
    table_name: 'Name',
    table_type: 'Type',
    table_location: 'Location',
    table_status: 'Status',
    stat_total: 'Total objects',
    stat_active: 'Active',
    stat_inactive: 'Inactive',
    stat_locations: 'Locations',
    stat_locations_suffix: 'unique rooms',
    zones_title: 'Detected zones',
    zone_active: 'Active zone',
    account_title: 'My Account',
    session_admin: 'Admin Session',
    session_desc: 'Logged in as manager',
    server_status: 'Server Status',
    server_ok: 'MongoDB backend: Operational',
    logout: 'Logout',
    forgot_password: 'Forgot password?',
    ph_email: 'example@mail.com',
    ph_password: '••••••••',
    ph_confirm_password: '••••••••',
    ph_object_name: 'Ex: Desk lamp...',
    ph_object_location: 'Office 101',

    about_title: 'Why IntelliBuild?',
    about_text: 'IntelliBuild centralizes management of connected objects in a smart building to improve efficiency, security and visibility.',

    login_title: 'Login',
    login_sub: 'Access your connected objects management platform',
    label_email: 'Email',
    label_password: 'Password',
    btn_signin: 'Sign In',
    auth_link_register: 'Don\'t have an account? <a href="register.html">Create account</a>',

    register_title: 'Create an account',
    register_sub: 'Join the IntelliBuild platform',
    label_fullname: 'Full name',
    label_confirm_password: 'Confirm password',
    btn_signup: 'Sign Up',
    auth_link_login: 'Already have an account? <a href="login.html">Sign in</a>',

    // language names
    lang_fr: 'French',
    lang_en: 'English',
    lang_ar: 'Arabic'
    ,
    // About page specific
    about_hero_title: 'Welcome to IntelliBuild',
    about_hero_text: 'The intelligent solution to manage and optimize modern buildings.',
    features_section_title: 'Our Features',
    mission_title: 'Our Mission',
    mission_text: 'We aim to simplify smart building management while improving energy efficiency and safety.',
    footer_text: '© 2026 IntelliBuild - All rights reserved'
    ,
    // why-us section
    why1_title: 'Web Standard',
    why1_text: 'Based on W3C Thing Description and Schema.org.',
    why2_title: 'Intuitive interface',
    why2_text: 'Easy to use for non-technical users.',
    why3_title: 'Modern architecture',
    why3_text: 'FastAPI, MongoDB, Frontend web.',
    why4_title: 'Extensible',
    why4_text: 'Easily add new object types.',
    why5_title: 'Strong academic project',
    why5_text: 'Compliant with PFE requirements.',
    why6_title: 'Teamwork',
    why6_text: 'Collaborative development.',
    // stats
    stats1_label: 'Object types',
    stats2_label: 'Simulated objects',
    stats3_label: 'Team members',

    nav_history: 'History',
    nav_role: 'Role',
    user_recent_objects: 'Recent objects',
    lang_title: 'Language',
    lang_active: 'Active language',
    menu_profile: 'My profile',
    detail_overlay_title: 'Object details',
    detail_name: 'Name',
    detail_type: 'Type',
    detail_location: 'Location',
    detail_status: 'Status',
    history_overlay_title: 'User history',
    history_date: 'Date',
    history_action: 'Action',
    history_detail: 'Detail',
    history_status: 'Status',
    history_empty: 'No actions yet.',
    role_overlay_title: 'User role',
    role_user_chip: 'User',
    role_consultation_title: 'Consultation',
    role_consultation_text: 'Can view the object list and each object detail.',
    role_history_title: 'History',
    role_history_text: 'Can view personal action history on the dashboard.',
    role_settings_title: 'Personal settings',
    role_settings_text: 'Can change display language (FR, EN, AR).',
    status_active_label: 'Active',
    status_inactive_label: 'Inactive'
  },
  ar: {
    p1_doc_title: 'IntelliBuild – الأجهزة الذكية',
    login_doc_title: 'تسجيل الدخول – IntelliBuild',
    register_doc_title: 'إنشاء حساب – IntelliBuild',

    brand: 'IntelliBuild',
    nav_home: 'الرئيسية',
    nav_features: 'الميزات',
    nav_about: 'عن المنصة',
    nav_dashboard: 'لوحة التحكم',
    nav_add: 'إضافة',
    nav_objects: 'عناصر',
    nav_locations: 'مواقع',
    nav_settings: 'الإعدادات',
    btn_login: 'تسجيل الدخول',
    btn_register: 'إنشاء حساب',

    title: 'منصة ذكية لإدارة الأشياء المتصلة',
    subtitle: 'حل حديث لوصف وإدارة وتأمين والبحث عن الأشياء المتصلة في مبنى ذكي.',
    start: 'ابدأ',
    discover: 'اكتشف',

    feature1_title: 'إدارة',
    feature1_text: 'إضافة وتعديل وحذف الأجهزة المتصلة بسهولة.',
    feature2_title: 'الأمان',
    feature2_text: 'التحكم بالوصول، حماية البيانات والمراقبة الذكية.',
    feature3_title: 'البحث',
    feature3_text: 'بحث سريع حسب النوع أو الموقع أو حالة الجهاز.',

    search_objects: 'ابحث عن عنصر...',
    objects_all: 'كل العناصر',
    new_object: 'عنصر جديد',
    add_object_title: 'إضافة عنصر',
    add_object_sub: 'املأ معلومات الجهاز',
    add_object_name: 'اسم العنصر',
    add_object_type: 'النوع',
    add_object_location: 'الموقع',
    add_object_description: 'الوصف',
    add_object_status: 'الحالة',
    status_available: 'متاح',
    status_offline: 'غير متصل',
    btn_cancel: 'إلغاء',
    btn_save: 'حفظ',
    table_name: 'الاسم',
    table_type: 'النوع',
    table_location: 'الموقع',
    table_status: 'الحالة',
    stat_total: 'إجمالي العناصر',
    stat_active: 'نشط',
    stat_inactive: 'غير نشط',
    stat_locations: 'المواقع',
    stat_locations_suffix: 'غرف فريدة',
    zones_title: 'المناطق المكتشفة',
    zone_active: 'منطقة نشطة',
    account_title: 'حسابي',
    session_admin: 'جلسة المسؤول',
    session_desc: 'متصل كمدير',
    server_status: 'حالة الخادم',
    server_ok: 'MongoDB: يعمل',
    logout: 'تسجيل الخروج',
    forgot_password: 'نسيت كلمة المرور؟',
    ph_email: 'example@mail.com',
    ph_password: '••••••••',
    ph_confirm_password: '••••••••',
    ph_object_name: 'مثال: مصباح مكتب...',
    ph_object_location: 'مكتب 101',

    about_title: 'لماذا IntelliBuild؟',
    about_text: 'تجمع IntelliBuild إدارة الأجهزة المتصلة لتحسين الكفاءة والأمان والرؤية.',

    login_title: 'تسجيل الدخول',
    login_sub: 'ادخل إلى منصة إدارة أجهزتك المتصلة',
    label_email: 'البريد الإلكتروني',
    label_password: 'كلمة المرور',
    btn_signin: 'تسجيل الدخول',
    auth_link_register: 'ليس لديك حساب؟ <a href="register.html">إنشاء حساب</a>',

    register_title: 'إنشاء حساب',
    register_sub: 'انضم إلى منصة IntelliBuild',
    label_fullname: 'الاسم الكامل',
    label_confirm_password: 'تأكيد كلمة المرور',
    btn_signup: 'إنشاء حساب',
    auth_link_login: 'هل لديك حساب؟ <a href="login.html">تسجيل الدخول</a>',

    // language names
    lang_fr: 'الفرنسية',
    lang_en: 'الإنجليزية',
    lang_ar: 'العربية'
    ,
    // About page specific
    about_hero_title: 'مرحبًا بك في IntelliBuild',
    about_hero_text: 'الحل الذكي لإدارة وتحسين المباني الحديثة.',
    features_section_title: 'ميزاتنا',
    mission_title: 'مهمتنا',
    mission_text: 'نهدف إلى تبسيط إدارة المباني الذكية مع تحسين كفاءة الطاقة والأمان.',
    footer_text: '© 2026 IntelliBuild - جميع الحقوق محفوظة'
    ,
    // why-us section
    why1_title: 'معيار الويب',
    why1_text: 'قائم على W3C Thing Description و Schema.org.',
    why2_title: 'واجهة بديهية',
    why2_text: 'سهل الاستخدام للمستخدمين غير التقنيين.',
    why3_title: 'هندسة حديثة',
    why3_text: 'FastAPI، MongoDB، واجهة أمامية للويب.',
    why4_title: 'قابلة للتوسعة',
    why4_text: 'سهولة إضافة أنواع جديدة من الأجهزة.',
    why5_title: 'مشروع أكاديمي قوي',
    why5_text: 'متوافق مع متطلبات PFE.',
    why6_title: 'العمل الجماعي',
    why6_text: 'تطوير تعاوني.',
    // stats
    stats1_label: 'أنواع الأجهزة',
    stats2_label: 'أجهزة محاكاة',
    stats3_label: 'أعضاء الفريق',

    nav_history: 'السجل',
    nav_role: 'الدور',
    user_recent_objects: 'العناصر الحديثة',
    lang_title: 'اللغة',
    lang_active: 'اللغة النشطة',
    menu_profile: 'ملفي الشخصي',
    detail_overlay_title: 'تفاصيل العنصر',
    detail_name: 'الاسم',
    detail_type: 'النوع',
    detail_location: 'الموقع',
    detail_status: 'الحالة',
    history_overlay_title: 'سجل المستخدم',
    history_date: 'التاريخ',
    history_action: 'الإجراء',
    history_detail: 'التفاصيل',
    history_status: 'الحالة',
    history_empty: 'لا توجد إجراءات حاليا.',
    role_overlay_title: 'دور المستخدم',
    role_user_chip: 'مستخدم',
    role_consultation_title: 'الاستعراض',
    role_consultation_text: 'يمكنه رؤية قائمة العناصر وتفاصيل كل عنصر.',
    role_history_title: 'السجل',
    role_history_text: 'يمكنه الاطلاع على سجل الإجراءات في لوحة التحكم.',
    role_settings_title: 'الإعدادات الشخصية',
    role_settings_text: 'يمكنه تغيير لغة العرض (FR, EN, AR).',
    status_active_label: 'نشط',
    status_inactive_label: 'غير نشط'
  }
};

function setLang(lang) {
  const locale = (lang || 'fr').toLowerCase();
  if (!translations[locale]) return;

  // Update document title if present
  const titleEl = document.querySelector('title[data-key]');
  if (titleEl) {
    const key = titleEl.getAttribute('data-key');
    if (translations[locale][key]) document.title = translations[locale][key];
  }

  // Translate all elements with data-key
  document.querySelectorAll('[data-key]').forEach(el => {
    // skip elements marked to not translate
    if (el.getAttribute('data-translate') === 'false') return;
    const key = el.getAttribute('data-key');
    if (!key) return;
    const txt = translations[locale][key];
    if (txt === undefined) return; // skip missing keys
    if (el.tagName.toLowerCase() === 'title') return; // handled above
    if (el.getAttribute('data-html') === 'true') {
      el.innerHTML = txt;
    } else if (el.getAttribute('data-attr')) {
      el.setAttribute(el.getAttribute('data-attr'), txt);
    } else {
      el.textContent = txt;
    }
  });

  // Localize language selector option labels (keep option values as codes)
  let select = document.querySelector('select.lang, .lang-select');
  if (!select) {
    const container = document.querySelector('.lang');
    if (container) select = container.querySelector('select');
  }
  if (select) {
    select.querySelectorAll('option').forEach(opt => {
      const code = opt.value ? opt.value.trim().toLowerCase() : opt.textContent.trim().toLowerCase();
      const labelKey = `lang_${code}`;
      if (translations[locale] && translations[locale][labelKey]) {
        opt.textContent = translations[locale][labelKey];
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let select = document.querySelector('select.lang, .lang-select');
  if (!select) {
    const container = document.querySelector('.lang');
    if (container) select = container.querySelector('select');
  }
  if (select) {
    select.querySelectorAll('option').forEach(opt => {
      opt.value = opt.value ? opt.value.trim().toLowerCase() : opt.textContent.trim().toLowerCase();
    });
  }

  const saved = localStorage.getItem('lang') || (select ? select.value : 'fr') || 'fr';
  setLang(saved);
  if (select) select.value = saved;

  if (select) {
    select.addEventListener('change', (e) => {
      const v = e.target.value.toLowerCase();
      localStorage.setItem('lang', v);
      setLang(v);
    });
  }
});