import { configureStore } from '@reduxjs/toolkit'
import appReducer from '@/store/slices/appSlice'
import chatNewReducer from '@/store/slices/chatNew'
import routeReducer from './slices/route'
import chatReducer from './slices/chat'
import globalReducer from './slices/sideBar'

export const store = configureStore({
  reducer: {
    app: appReducer,
    chatNew: chatNewReducer,
    route: routeReducer,
    chat: chatReducer,
    global: globalReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
