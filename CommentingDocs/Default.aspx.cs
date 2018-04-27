using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml.Serialization;

namespace CommentingDocs
{
	public partial class _Default : Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
			if (!IsPostBack)
			{
				BindComments();
			}
		}

		private void BindComments()
		{
			var context = CommentDb.Load();
			hdnForHighlighter.Value = context.SerializedHighlight;
			rptComments.DataSource = context.Comments.Where(c => c.UserName.Equals(User.Identity.Name));
			rptComments.DataBind();
		}

		// todo: ajax this
		protected void btnAddComment_Click(object sender, EventArgs e)
		{
			var context = CommentDb.Load();
			var comments = context.Comments.ToList();
			comments.Add(new Comment { ID = Guid.NewGuid(), UserName = User.Identity.Name, SerializedSelection = hdnForAdd.Value });
			context.Comments = comments.ToArray();
			context.SerializedHighlight = hdnForHighlighter.Value;
			CommentDb.Save(context);
			BindComments();
		}

		// todo: ajax this
		protected void btnSave_Click(object sender, EventArgs e)
		{
			var b = sender as Button;
			var g = new Guid(b.CommandArgument);
			var context = CommentDb.Load();
			context.Comments.First(x => x.ID.Equals(g)).Text = (b.Parent.FindControl("txtText") as TextBox).Text;
			CommentDb.Save(context);
		}

		// todo: ajax this
		protected void btnDelete_Click(object sender, EventArgs e)
		{
			var b = sender as Button;
			var g = new Guid(b.CommandArgument);
			var context = CommentDb.Load();
			context.Comments = context.Comments.Where(c => !c.ID.Equals(g)).ToArray();
			context.SerializedHighlight = hdnForHighlighter.Value;
			CommentDb.Save(context);
			BindComments();
		}
	}
	
	public class Comment
	{
		public Guid ID;
		public string Text;
		public string UserName;
		public string SerializedSelection;
	}

	public class DocComments
	{
		public Comment[] Comments;
		public string SerializedHighlight;
	}

	public static class CommentDb
	{

		private static string filename = Path.Combine(Path.Combine(HttpContext.Current.Request.PhysicalApplicationPath, "App_Data"), "comments.xml");

		public static void Save(DocComments comments)
		{
			var sw = new StreamWriter(filename);
			var ser = new XmlSerializer(comments.GetType());
			ser.Serialize(sw, comments);
			sw.Close();
		}

		public static DocComments Load()
		{
			DocComments result = null;
			try
			{
				var reader = new XmlSerializer(typeof(DocComments));
				using (var file = new StreamReader(filename))
				{

					// Deserialize the content of the file into a Book object.
					result = (DocComments)reader.Deserialize(file);
				}
			}
			catch
			{
			}
			if (result == null)
				result = new DocComments() { Comments = new Comment[0] };

			return result;
		}
	}
}