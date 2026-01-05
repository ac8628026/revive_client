import { addContentService, deleteContentService, getContentService, getSharedService, getShareStatusService, updateShareService, type Content, type ContentPayload, type ShareContentPayload, type ShareContentResposne } from '@/services/contentService';
import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';


export const getContentThunk = createAsyncThunk<Content[],void,{rejectValue:string}>(
    "content/fetch",async(_,{rejectWithValue})=>{
       try{
          const res = await getContentService();
          return res.contents;
       }catch(err){
        return rejectWithValue((err as Error).message)
       }
    }
)

export const createContentThunk = createAsyncThunk<Content[],ContentPayload,{rejectValue:string}>(
    "content/create",async(payload:ContentPayload,{rejectWithValue})=>{
        try{
            const res = await addContentService(payload);
            return res.contents;
        }catch(err){
            return rejectWithValue((err as Error).message)
        }
    }
)

export const deleteContentThunk = createAsyncThunk<string,string,{rejectValue:string}>(
    "content/delete",async(id:string,{rejectWithValue})=>{
        try{
           await deleteContentService(id);
           return id;
        }catch(err){
            return rejectWithValue((err as Error).message ||"Failed to Delete")
        }
    }
)

export const getShareStatusThunk = createAsyncThunk<ShareContentResposne,void,{rejectValue:string}>(
    "contents/share/status",async(_,{rejectWithValue})=>{
        try {
            const res = getShareStatusService();
            return res;
        } catch (err) {
            return rejectWithValue((err as Error).message || "Unexpected Error")
        }
    }
) 

export const getShareThunk = createAsyncThunk<Content[],string,{rejectValue:string}>(
    "contents/share/",async(contentId,{rejectWithValue})=>{
        try {
            const res = await getSharedService(contentId);
            return  res.contents;
        } catch (err) {
            return rejectWithValue((err as Error).message || "Unexpected Error")
        }
    }
) 

export const updateShareThunk = createAsyncThunk<ShareContentResposne,ShareContentPayload,{rejectValue:string}>(
    "contents/share/update",async(payload,{rejectWithValue})=>{
        try {
            const res = updateShareService(payload);
            return res;
        } catch (err) {
            return rejectWithValue((err as Error).message || "Unexpected Error")
        }
    }
) 

type ContentState = {
  contents: Content[];

  fetching: boolean;
  fetchError: string | null;

  creating: boolean;
  createError: string | null;

  deleting:boolean;
  deleteError:string | null;

  getsharing:boolean;
  shareError:string | null;
  shareData:ShareContentResposne;

};


const initialState: ContentState = {
  contents:[],

  fetching: false,
  fetchError:  null,

  creating: false,
  createError: null,

  deleting: false,
  deleteError: null,

  getsharing:false,
  shareError: null,
  shareData:{shareId:"",shared:false}
};

const contentSlice = createSlice({
    name:"content",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
          .addCase(getContentThunk.pending,(state)=>{
            state.fetching = true;
            state.fetchError = null;
          })
          .addCase(getContentThunk.fulfilled,(state,action)=>{
            state.fetching = false;
            state.contents = action.payload
          })
         .addCase(getContentThunk.rejected,(state,action)=>{
           state.fetching = false;
           state.fetchError = action.payload ?? "Failed to Fetch contents"; 
          })
          .addCase(createContentThunk.pending,(state)=>{
            state.creating = true;
            state.createError = null;
          })
          .addCase(createContentThunk.fulfilled,(state,action)=>{
            state.creating = false;
            state.contents = action.payload
          })
         .addCase(createContentThunk.rejected,(state,action)=>{
           state.creating = false;
           state.createError = action.payload ?? "Failed to add content or fetch content"; 
          })

          .addCase(deleteContentThunk.pending,(state)=>{
            state.deleting = true;
            state.deleteError = null;
          })
          .addCase(deleteContentThunk.fulfilled,(state,action)=>{
            state.deleting = false;
            console.log(action.payload)
            state.contents.filter((s)=>s._id!==action.payload)
          })
         .addCase(deleteContentThunk.rejected,(state,action)=>{
           state.deleting = false;
           state.deleteError = action.payload ?? "Failed to delete content "; 
          })

          .addCase(getShareStatusThunk.pending,(state)=>{
            state.getsharing = true;
            state.shareData = {shareId:"",shared:false};
            state.shareError = null;
          })
           .addCase(getShareStatusThunk.fulfilled,(state,action)=>{
            state.getsharing = false;
            state.shareData = action.payload;
          })
           .addCase(getShareStatusThunk.rejected,(state,action)=>{
            state.getsharing = false;
            state.shareError = action.payload ?? "Failed to Share Status";
          })

          .addCase(updateShareThunk.pending,(state)=>{
            state.getsharing = true;
            state.shareData = {shareId:"",shared:false};
            state.shareError = null;
          })
           .addCase(updateShareThunk.fulfilled,(state,action)=>{
            state.getsharing = false;
            state.shareData = action.payload;
          })
           .addCase(updateShareThunk.rejected,(state,action)=>{
            state.getsharing = false;
            state.shareError = action.payload ?? "Failed to Share Brain";
          })

          .addCase(getShareThunk.pending,(state)=>{
            state.fetching = true;
            state.fetchError = null
          })
           .addCase(getShareThunk.fulfilled,(state,action)=>{
            state.fetching = false;
            state.contents = action.payload
          })
           .addCase(getShareThunk.rejected,(state,action)=>{
            state.fetching = false;
            state.fetchError = action.payload ?? "Failed to Share Brain";
          })

    }
})

export default contentSlice.reducer;