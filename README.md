# **Renttar – Mobile-First Rental Marketplace MVP**

**Tech Residency Program - 8 Week Sprint**

**Employer:** African Geospace

---

## **1. Vision & Purpose**

**Renttar** is a mobile-first, peer-to-peer rental marketplace connecting users to rent gear, spaces, and services locally. This MVP focuses on core mobile functionality that leverages location services, camera integration, and push notifications to create an intuitive rental experience.

**Educational Goals:**

- Transition bootcamp graduates from web to mobile development
- Build practical GitHub collaboration skills
- Apply Flask backend knowledge in a mobile context
- Learn React Native fundamentals through hands-on development

---

## **2. Development Strategy & Timeline**

### **Phase 1: Foundation (Weeks 1-2)**

**Goal:** Establish basic web prototype to validate core functionality

- Set up development environment and team workflows
- Build minimal Flask API with core endpoints
- Create simple web interface for testing
- **Learning Focus:** GitHub workflows, API design, team collaboration

### **Phase 2: Mobile Pivot (Weeks 3-6)**

**Goal:** Develop React Native mobile app with core features

- Initialize React Native project with Expo
- Implement mobile-optimized UI/UX
- Integrate with Flask backend
- **Learning Focus:** React Native fundamentals, mobile development patterns

### **Phase 3: Polish & Deploy (Weeks 7-8)**

**Goal:** Complete MVP and prepare for demo

- Bug fixes and performance optimization
- Deploy backend to cloud platform
- Prepare app for demo presentation
- **Learning Focus:** Deployment, testing, presentation skills

---

## **3. Technical Architecture (Mobile-Optimized)**

| **Layer** | **Technology** | **Rationale** |
| --- | --- | --- |
| **Mobile App** | React Native + Expo | Beginner-friendly, good documentation, cross-platform |
| **Backend** | Flask + SQLAlchemy | Leverage existing student knowledge |
| **Database** | SQLite (dev) → PostgreSQL (prod) | Simple transition, familiar to students |
| **Authentication** | Flask-JWT-Extended | Builds on student JWT knowledge |
| **File Storage** | Local (dev) → AWS S3 (prod) | Progressive complexity |
| **Maps** | React Native Maps | Essential for mobile rental marketplace |
| **Push Notifications** | Expo Notifications | Mobile-specific engagement feature |
| **Deployment** | Heroku (backend) + Expo Go (mobile) | Student-friendly platforms |

---

## **4. Core Mobile Features (MVP Scope)**

### **4.1 Essential Features**

1. **User Authentication**
    - Sign up/login with email
    - JWT token management
    - Basic profile setup
2. **Location-Based Item Discovery**
    - Map view of nearby rental items
    - List view with distance sorting
    - Basic search and filter (category, price range)
3. **Item Listing Management**
    - Camera integration for photos
    - Simple form for item details
    - Availability calendar (basic)
4. **Basic Messaging**
    - In-app chat between users
    - Simple text messaging
    - Basic notification system
5. **Booking Flow**
    - Request to rent
    - Accept/decline functionality
    - Basic booking confirmation

### **4.2 Mobile-Specific Enhancements**

- **Push Notifications:** New messages, booking updates
- **Camera Integration:** Photo capture for listings
- **Location Services:** Auto-detect user location
- **Offline Capability:** Basic caching of viewed items

---

## **5. Student Role Assignments & Learning Objectives**

| **Role** | **Primary Responsibilities** | **Learning Goals** | **Student Background Match** |
| --- | --- | --- | --- |
| **Mobile Lead (SE-FE)** | React Native UI, navigation, mobile UX | React Native, mobile design patterns | Java/OOP → React concepts |
| **Mobile Developer (SE-FE)** | Component development, state management | React Native, mobile-specific features | Java/OOP → React concepts |
| **Backend Lead (SE-BE)** | Flask API design, database schema | Flask scaling, mobile API patterns | Flask/SQLAlchemy experience |
| **Backend Developer (SE-BE)** | API endpoints, authentication, file handling | Flask best practices, mobile integration | Flask/SQLAlchemy experience |
| **Data & Analytics** | User metrics, testing data, performance monitoring | Mobile analytics, data visualization | Python background |
| **Security & Testing** | API security, mobile security, testing workflows | Mobile security patterns, automated testing | General security principles |

---

## **6. Weekly Sprint Breakdown**

### **Week 1: Project Setup & Team Formation**

**Backend Tasks:**

- Set up Flask project structure
- Design database schema (Users, Items, Bookings)
- Create basic API endpoints (auth, CRUD operations)

**Mobile Tasks:**

- Initialize React Native + Expo project
- Set up navigation structure
- Create basic screens (wireframes)

**Team Tasks:**

- GitHub repository setup and branching strategy
- Development environment standardization
- Team communication protocols

**Deliverable:** Working local development setup for all team members

---

### **Week 2: Core Backend + Basic Mobile Shell**

**Backend Tasks:**

- Implement user authentication (JWT)
- Build Items API (CRUD)
- Basic file upload functionality

**Mobile Tasks:**

- Authentication screens (login/signup)
- Basic navigation between screens
- API connection setup

**Learning Focus:** API design, React Native basics, team Git workflows

**Deliverable:** Basic mobile app that can authenticate users

---

### **Week 3: Location Features + Mobile UI**

**Backend Tasks:**

- Add geolocation fields to items
- Location-based search endpoints
- Image storage integration

**Mobile Tasks:**

- Implement map view with React Native Maps
- Location permissions and GPS integration
- Basic item display on map

**Learning Focus:** Mobile permissions, map integration, location services

**Deliverable:** Mobile app showing items on a map

---

### **Week 4: Camera & Listing Creation**

**Backend Tasks:**

- Image upload and processing
- Item creation/update endpoints
- User profile endpoints

**Mobile Tasks:**

- Camera integration for item photos
- Item creation form
- Image preview and upload

**Learning Focus:** Camera APIs, file handling, form management in mobile

**Deliverable:** Users can create listings with photos from mobile app

---

### **Week 5: Messaging System**

**Backend Tasks:**

- Message endpoints and database design
- Real-time messaging foundation
- Notification trigger system

**Mobile Tasks:**

- Chat interface development
- Message list and conversation views
- Basic push notification setup

**Learning Focus:** Real-time communication, mobile notifications

**Deliverable:** Users can message each other through the app

---

### **Week 6: Booking Flow & User Experience**

**Backend Tasks:**

- Booking request/response endpoints
- Booking status management
- User notification logic

**Mobile Tasks:**

- Booking request interface
- Booking management screens
- Push notification integration

**Learning Focus:** Complex mobile workflows, state management

**Deliverable:** Complete booking flow from request to confirmation

---

### **Week 7: Polish & Testing**

**Backend Tasks:**

- API optimization and error handling
- Deploy to Heroku or similar platform
- Performance monitoring setup

**Mobile Tasks:**

- UI/UX polish and consistency
- Bug fixes and performance optimization
- App testing on multiple screen sizes

**Learning Focus:** Deployment, performance optimization, user testing

**Deliverable:** Deployed backend and polished mobile app

---

### **Week 8: Demo Preparation & Final Integration**

**Backend Tasks:**

- Final bug fixes
- Demo data preparation
- Documentation completion

**Mobile Tasks:**

- Final UI polish
- Demo scenario preparation
- App store preparation (metadata, icons)

**Team Tasks:**

- Demo presentation preparation
- Project documentation
- Individual portfolio preparation

**Deliverable:** Complete MVP ready for stakeholder demo

---

## **Risk Mitigation & Contingency Plans**

### **Technical Risks**

| **Risk** | **Mitigation Strategy** |
| --- | --- |
| **React Native Learning Curve** | Start with Expo, provide extensive documentation, pair programming |
| **Mobile Testing Limitations** | Focus on simulator testing, provide device testing guidelines |
| **Backend-Mobile Integration** | Start integration early, extensive API testing |
| **GitHub Workflow Issues** | Mandatory workshop, template repositories, peer mentoring |

### **Educational Risks**

| **Risk** | **Mitigation Strategy** |
| --- | --- |
| **Overwhelming Technology Stack** | Progressive complexity, focus on MVP first |
| **Team Collaboration Challenges** | Clear role definitions, conflict resolution processes |
| **Individual Skill Gaps** | Peer mentoring, additional resources, flexible role assignments |
