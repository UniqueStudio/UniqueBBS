import * as parser from "fast-xml-parser";

const str = `<xml>
<ToUserName><![CDATA[toUser]]></ToUserName>
<FromUserName><![CDATA[sys]]></FromUserName> 
<CreateTime>1403610513</CreateTime>
<MsgType><![CDATA[event]]></MsgType>
<Event><![CDATA[change_contact]]></Event>
<ChangeType>create_user</ChangeType>
<UserID><![CDATA[zhangsan]]></UserID>
<Name><![CDATA[张三]]></Name>
<Department><![CDATA[1,2,3]]></Department>
<IsLeaderInDept><![CDATA[1,0,0]]></IsLeaderInDept>
<Position><![CDATA[产品经理]]></Position>
<Mobile>15913215421</Mobile>
<Gender>1</Gender>
<Email><![CDATA[zhangsan@gzdev.com]]></Email>
<Status>1</Status>
<Avatar><![CDATA[http://wx.qlogo.cn/mmopen/ajNVdqHZLLA3WJ6DSZUfiakYe37PKnQhBIeOQBO4czqrnZDS79FH5Wm5m4X69TBicnHFlhiafvDwklOpZeXYQQ2icg/0]]></Avatar>
<Alias><![CDATA[zhangsan]]></Alias>
<Telephone><![CDATA[020-3456788]]></Telephone>
<ExtAttr>
    <Item>
    <Name><![CDATA[爱好]]></Name>
    <Type>0</Type>
    <Text>
        <Value><![CDATA[旅游]]></Value>
    </Text>
    </Item>
    <Item>
    <Name><![CDATA[卡号]]></Name>
    <Type>1</Type>
    <Web>
        <Title><![CDATA[企业微信]]></Title>
        <Url><![CDATA[https://work.weixin.qq.com]]></Title>
    </Web>
    </Item>
</ExtAttr>
</xml>`;

const result = parser.parse(str);
console.log(result);
