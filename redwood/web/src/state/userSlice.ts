import {createSlice, PayloadAction} from '@reduxjs/toolkit'

type UserState = {
  ethereumAddress?: string
  email?: string

  unsubmittedProfile?: {
    id: number
  }

  cachedProfile?: {
    id: string
  }
}

const initialState: UserState = {}

export const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    setPhoto: (state, action: PayloadAction<UserState['photo']>) => {
      state.photo = action.payload
    },
    setVideo: (state, action: PayloadAction<UserState['video']>) => {
      state.video = action.payload
    },
    reset: () => initialState,
  },
})
