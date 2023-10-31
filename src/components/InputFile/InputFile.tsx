import React, { Fragment, useRef } from 'react'
import config from 'src/constants/config'
import { toast } from 'react-toastify'

interface Props {
  onChange?: (file?: File) => void
}

export default function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (fileFromLocal && (fileFromLocal.size >= config.maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
      toast.error(
        `Dụng lượng file tối đa 1 MB
      Định dạng:.JPEG, .PNG`,
        { position: 'top-center' }
      )
    } else {
      onChange && onChange(fileFromLocal)
    }
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <Fragment>
      <input
        name='avatar'
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        ref={fileInputRef}
        onChange={onFileChange}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={(event) => ((event.target as any).value = null)}
      />

      <button
        className=' flex  h-10 items-center justify-end  py-3 px-4 rounded-sm text-sm text-gray-600 shadow-sm bg-white border border-black/10'
        type='button'
        onClick={handleUpload}
      >
        Chọn Ảnh
      </button>
    </Fragment>
  )
}
