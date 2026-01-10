import { configureStore, combineReducers} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice'
import companyReducer from './slices/companySlice';
import jobReducer from './slices/jobSlice';
import candidateReducer from './slices/candidateSlice'
import applicationReducer from './slices/applicationSlice'
import adminReducer from './slices/adminSlice'
import selectionStageReducer from './slices/selectionStageSlice';
import subscriptionPlanReducer from './slices/subscriptionPlanSlice';
import resumeScreeningReducer from './slices/resumeScreeningSlice';
import telephonicReducer from './slices/telephonicSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only persist auth slice
};

const rootReducer = combineReducers({
  auth: authReducer,
  company: companyReducer,
  job: jobReducer,
  candidate:candidateReducer,
  application:applicationReducer,
  admin:adminReducer,
  selectionStage:selectionStageReducer,
  subscriptionPlan:subscriptionPlanReducer,
  resumeScreener:resumeScreeningReducer,
  telephonic:telephonicReducer,

});


const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
