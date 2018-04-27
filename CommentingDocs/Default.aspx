<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="CommentingDocs._Default" %>

<asp:Content runat="server" ID="FeaturedContent" ContentPlaceHolderID="FeaturedContent">
    <section class="featured">
        <div class="content-wrapper">
            <hgroup class="title">
                <h1><%: Title %>.</h1>
            </hgroup>
            <p>
                testing commenting
            </p>
        </div>
    </section>
</asp:Content>
<asp:Content runat="server" ID="BodyContent" ContentPlaceHolderID="MainContent">
    <table style="width:1200px;">
        <tr>
            <td>
                <h3>comment on this:</h3>
                <div class="commentable" id="commentable">
                    <iframe id="IFrameDocument" src='<%= ResolveUrl("~/modi/aspose.html") %>' width="800" height ="500">
                    </iframe>
                </div>
            </td>
            <td style="width:300px;">
                <asp:UpdatePanel runat="server" ID="updPanel">
                    <ContentTemplate>
                        <asp:HiddenField ID="hdnForHighlighter" runat="server" />
                        <asp:Button ID="btnAddComment" OnClick="btnAddComment_Click" Text="Add comment" runat="server" CssClass="addcommentbutton" OnClientClick="return addbuttonclick();"/>
                        <asp:HiddenField ID="hdnForAdd" runat="server"/>
                        <table>                
                        <asp:Repeater runat="server" ID="rptComments">
                            <ItemTemplate>
                                <tr><td class="acomment" data-id="<%# ((CommentingDocs.Comment)Container.DataItem).SerializedSelection %>">
                                    <asp:HiddenField runat="server" ID="hdnCommentSerializedSelection" Value="<%# ((CommentingDocs.Comment)Container.DataItem).SerializedSelection %>"/>
                                    <asp:TextBox runat="server" Width="100" ID="txtText" Text="<%# ((CommentingDocs.Comment)Container.DataItem).Text %>" CssClass="textbox" data-id="<%# ((CommentingDocs.Comment)Container.DataItem).SerializedSelection %>"/>
                                    <asp:Button runat="server" Text="Save" CommandArgument="<%# ((CommentingDocs.Comment)Container.DataItem).ID %>" OnClick="btnSave_Click" />
                                    <asp:Button ID="btnDelete" runat="server" Text="Delete" CommandArgument="<%# ((CommentingDocs.Comment)Container.DataItem).ID %>" OnClick="btnDelete_Click" OnClientClick='<%# string.Format("return deletebuttonclick({0});", ((CommentingDocs.Comment)Container.DataItem).SerializedSelection) %>' />
                                </td></tr>
                            </ItemTemplate>
                        </asp:Repeater>
                        </table>
                    </ContentTemplate>
                </asp:UpdatePanel>
            </td>
        </tr>
    </table>
</asp:Content>
