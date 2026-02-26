import { useReducer, useCallback, useEffect } from 'react'
import { EditorState, Operation } from '../types/editor'

const MAX_OPERATIONS = 100

type EditorAction =
  | { type: 'SET_IMAGE'; image: HTMLImageElement }
  | { type: 'PUSH_OPERATION'; operation: Operation }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' }
  | { type: 'SET_CANVAS_SIZE'; width: number; height: number }
  | { type: 'SET_FLATTENING'; value: boolean }
  | { type: 'FLATTEN'; image: HTMLImageElement }
  | { type: 'IMPORT_SESSION'; operations: Operation[] }

const initialState: EditorState = {
  originalImage: null,
  operations: [],
  historyIndex: -1,
  isFlattening: false,
  canvasSize: { width: 800, height: 600 },
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_IMAGE':
      return {
        ...state,
        originalImage: action.image,
        operations: [],
        historyIndex: -1,
        isFlattening: false,
        canvasSize: {
          width: action.image.naturalWidth || action.image.width,
          height: action.image.naturalHeight || action.image.height,
        },
      }

    case 'PUSH_OPERATION': {
      // Truncate future history past current index
      let newOps = state.operations.slice(0, state.historyIndex + 1)
      newOps.push(action.operation)
      // Enforce MAX_OPERATIONS limit: drop oldest if exceeded
      if (newOps.length > MAX_OPERATIONS) {
        newOps = newOps.slice(newOps.length - MAX_OPERATIONS)
      }
      return {
        ...state,
        operations: newOps,
        historyIndex: newOps.length - 1,
      }
    }

    case 'UNDO':
      if (state.historyIndex < 0) return state
      return { ...state, historyIndex: state.historyIndex - 1 }

    case 'REDO':
      if (state.historyIndex >= state.operations.length - 1) return state
      return { ...state, historyIndex: state.historyIndex + 1 }

    case 'RESET':
      return {
        ...state,
        operations: [],
        historyIndex: -1,
        isFlattening: false,
      }

    case 'SET_CANVAS_SIZE':
      return {
        ...state,
        canvasSize: { width: action.width, height: action.height },
      }

    case 'SET_FLATTENING':
      return { ...state, isFlattening: action.value }

    case 'FLATTEN':
      return {
        ...state,
        originalImage: action.image,
        operations: [],
        historyIndex: -1,
        isFlattening: false,
        canvasSize: {
          width: action.image.naturalWidth || action.image.width,
          height: action.image.naturalHeight || action.image.height,
        },
      }

    case 'IMPORT_SESSION': {
      const ops = action.operations.slice(0, MAX_OPERATIONS)
      return {
        ...state,
        operations: ops,
        historyIndex: ops.length - 1,
      }
    }

    default:
      return state
  }
}

export function useEditorState() {
  const [state, dispatch] = useReducer(editorReducer, initialState)

  const setImage = useCallback((image: HTMLImageElement) => {
    dispatch({ type: 'SET_IMAGE', image })
  }, [])

  const pushOperation = useCallback((operation: Operation) => {
    dispatch({ type: 'PUSH_OPERATION', operation })
  }, [])

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' })
  }, [])

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const setFlattening = useCallback((value: boolean) => {
    dispatch({ type: 'SET_FLATTENING', value })
  }, [])

  const flatten = useCallback((image: HTMLImageElement) => {
    dispatch({ type: 'FLATTEN', image })
  }, [])

  const importSession = useCallback((operations: Operation[]) => {
    dispatch({ type: 'IMPORT_SESSION', operations })
  }, [])

  const canUndo = state.historyIndex >= 0
  const canRedo = state.historyIndex < state.operations.length - 1

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
        e.preventDefault()
        dispatch({ type: 'REDO' })
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        dispatch({ type: 'UNDO' })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    state,
    setImage,
    pushOperation,
    undo,
    redo,
    reset,
    setFlattening,
    flatten,
    importSession,
    canUndo,
    canRedo,
  }
}
