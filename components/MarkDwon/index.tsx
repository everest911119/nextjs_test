import MDEditor, {
  commands



} from '@uiw/react-md-editor';

import { MDEditorProps } from '@uiw/react-md-editor';
import { Button, message, Upload,UploadProps } from 'antd';
import { useRef, useState } from 'react';
interface IProps extends MDEditorProps {
  // eslint-disable-next-line no-unused-vars
  handleContentChange: (value?: string) => void;
}
import { UploadOutlined } from '@ant-design/icons';

import COS from 'cos-js-sdk-v5';
import { UploadFile } from 'antd/lib/upload/interface';
const MDRender = (props: IProps) => {
  const { value, handleContentChange, ...rest } = props;
  const [selectedList, setFileList] = useState<UploadFile<any>>({
    uid:'',
    name:'',
    url:'',
  });
  const currentUid = useRef('')
  return (
    <div>
      <MDEditor
        value={value}
        onChange={handleContentChange}
        {...rest}
        commands={[
          commands.bold,
          commands.hr,
          commands.italic,
          commands.divider,
          commands.codeEdit,
          commands.codeLive,
          commands.codePreview,
          commands.divider,
          commands.fullscreen,
          commands.divider,
          commands.group([], {
            name: "update",
            groupName: "update",
            icon: (
              <svg viewBox="0 0 1024 1024" width="12" height="12">
                <path
                  fill="currentColor"
                  d="M716.8 921.6a51.2 51.2 0 1 1 0 102.4H307.2a51.2 51.2 0 1 1 0-102.4h409.6zM475.8016 382.1568a51.2 51.2 0 0 1 72.3968 0l144.8448 144.8448a51.2 51.2 0 0 1-72.448 72.3968L563.2 541.952V768a51.2 51.2 0 0 1-45.2096 50.8416L512 819.2a51.2 51.2 0 0 1-51.2-51.2v-226.048l-57.3952 57.4464a51.2 51.2 0 0 1-67.584 4.2496l-4.864-4.2496a51.2 51.2 0 0 1 0-72.3968zM512 0c138.6496 0 253.4912 102.144 277.1456 236.288l10.752 0.3072C924.928 242.688 1024 348.0576 1024 476.5696 1024 608.9728 918.8352 716.8 788.48 716.8a51.2 51.2 0 1 1 0-102.4l8.3968-0.256C866.2016 609.6384 921.6 550.0416 921.6 476.5696c0-76.4416-59.904-137.8816-133.12-137.8816h-97.28v-51.2C691.2 184.9856 610.6624 102.4 512 102.4S332.8 184.9856 332.8 287.488v51.2H235.52c-73.216 0-133.12 61.44-133.12 137.8816C102.4 552.96 162.304 614.4 235.52 614.4l5.9904 0.3584A51.2 51.2 0 0 1 235.52 716.8C105.1648 716.8 0 608.9728 0 476.5696c0-132.1984 104.8064-239.872 234.8544-240.2816C258.5088 102.144 373.3504 0 512 0z"
                />
              </svg>
            ),
            children: (handle: any) => {
              console.log('init')
              const cos =  new COS({
                SecretId: process.env.NEXT_PUBLIC_COS_SECRETID,
                SecretKey: process.env.NEXT_PUBLIC_COS_SECRETKEY
              })
              const props: UploadProps = {
                beforeUpload: (file:any) => {
                  const types =  ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
                  
                  if (!types.some(item=>item===file.type)) {
                    message.error(`${file.name} is not a png file`);
                    return false
                  }
                  const maxSize = 5*1024*1024
                  if (file.size>maxSize) {
                    message.error(`${file.name} exceed max size`)
                    return false
                  }
                  const suffix = file.name.slice(file.name.lastIndexOf('.'));
                  const filename = Date.now() + suffix; 
                  file.url = filename
                  console.log(file.uid,'file')
                  currentUid.current = file.uid
                  // file.url = filename
                return file
                },
                onChange: ({file, fileList}) => {
                  
                  console.log(file.percent, 'onchange')
                  if (file.percent===0){
                    setFileList((prev)=>Object.assign(prev,{
                    ...fileList[0]
                  }))
                  }
                  
                  
                },
                maxCount:1,
                customRequest:({file,onProgress : CRonProgress,onSuccess}:any) => {
                  if (file) {
                    cos.putObject({
                      Bucket: 'abcde-1307494188',
                      Region: 'ap-nanjing',
                      Key: file.url,
                      Body: file, // 要上传的文件对象
                      StorageClass: 'STANDARD', // 上传的类型
                      onProgress(progressData) {
                        // console.log(progressData.percent)
                        // console.log(((progressData.percent * 100)));
                        CRonProgress({percent:(progressData.percent * 100).toFixed(2)},file)
                      }
                    },(err, data)=> {
                      if (!err && data.statusCode ===200) {
                        
                        if (String(selectedList?.uid)=== String(currentUid.current)){
                        const onFinishList = 'http://' + data.Location
                        console.log(onFinishList)
                        setFileList((prev)=> Object.assign(prev,{url:onFinishList}))
                        
                        handle.execute()
                        handle.close()
                        onSuccess(file)
                      }else{
                        handle.execute()
                      }
                        
                      }
                    })
                  }
                },
              
              }
              return (
                <div style={{ width: 120, padding: 10 }}>
                  <div>My Custom Toolbar</div>
                  <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
             
                </div>
              );
            },
            execute: (
              state: commands.TextState,
              api: commands.TextAreaTextApi,
            ) => {
              if (selectedList.url) {
                let modifyText = `![](${selectedList.url}) ${state.selectedText}\n `;
                if (!state.selectedText) {
                  modifyText = `![](${selectedList.url}) `;
                  
                }
                api.replaceSelection(modifyText)
                setFileList((prev)=>Object.assign(prev,{
                  uid:'',name:'',url:'',
                }))
                currentUid.current = ''
              }
              console.log(selectedList,'fielist execute')
              
              
              
            },
            buttonProps: { "aria-label": "Insert title" }
          })

        ]}
        
      />
      {/* <Modal visible={visible} title="上传文件">
        <UpLoader
          onClose={() => setVisible(false)}
          fileList={fileList}
          setFileList={setFileList}
        />
      </Modal> */}
    </div>
  );
};

export default MDRender;
