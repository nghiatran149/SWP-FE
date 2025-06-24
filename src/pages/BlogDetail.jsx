import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, FileText, ChevronLeft, ChevronRight, Clock, BookOpen } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  
  // Mock dữ liệu blog
  const blogPosts = [
    {
      id: 1,
      title: '5 Dấu hiệu nhận biết sự dụng ma túy ở thanh thiếu niên',
      excerpt: 'Làm thế nào để nhận biết sớm các dấu hiệu sử dụng ma túy ở con em mình? Bài viết này sẽ giúp phụ huynh và giáo viên nhận biết các dấu hiệu cảnh báo sớm.',
      date: '10/5/2023',
      readTime: '8 phút đọc',
      author: 'TS. Nguyễn Văn A',
      category: 'Thanh thiếu niên',
      featured: true,
      image: 'https://images.unsplash.com/photo-1587826154528-f1adec0a1cfd?q=80&w=2070',
      content: `
        <div class="mb-8">
          <img src="https://images.unsplash.com/photo-1561379241-8fdc225e57e5?q=80&w=2070" alt="Teen drug awareness" class="rounded-xl w-full h-auto shadow-md">
          <p class="text-sm text-gray-500 mt-2 text-center italic">Nhận biết sớm các dấu hiệu sử dụng ma túy ở thanh thiếu niên là rất quan trọng</p>
        </div>
        
        <div class="text-center mb-8 p-6 bg-emerald-50 rounded-lg border border-emerald-100">
          <h2 class="text-2xl font-semibold text-emerald-800 mb-3">Tóm tắt nội dung</h2>
          <p class="text-emerald-700">Bài viết này sẽ giúp phụ huynh và giáo viên nhận biết 5 dấu hiệu cảnh báo sớm về việc sử dụng ma túy ở thanh thiếu niên, từ thay đổi bạn bè đến các biểu hiện thể chất.</p>
        </div>
        
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Nhận biết các dấu hiệu sớm</h2>
        <p class="text-lg leading-relaxed mb-6">Nhận biết các dấu hiệu sử dụng ma túy ở thanh thiếu niên có thể rất khó khăn. Nhiều dấu hiệu của việc sử dụng chất gây nghiện có thể giống với những thay đổi tâm trạng và hành vi bình thường của tuổi vị thành niên. Tuy nhiên, phụ huynh và giáo viên vẫn nên chú ý đến những thay đổi rõ rệt và đột ngột.</p>
        
        <p class="text-lg leading-relaxed mb-8 font-medium">Dưới đây là 5 dấu hiệu cảnh báo phổ biến mà bạn nên lưu ý:</p>
        
        <div class="mb-10">
          <img src="https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=2070" alt="Teen behavior changes" class="rounded-xl w-full h-auto shadow-md mb-6">
        
          <h3 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</span>
            Thay đổi bạn bè và thói quen xã hội
          </h3>
          
          <p class="text-lg leading-relaxed mb-4 pl-11">Một trong những dấu hiệu đáng lo ngại nhất là khi con bạn đột nhiên thay đổi nhóm bạn bè. Nếu con bạn từ bỏ những người bạn lâu năm và bắt đầu giao du với những người bạn mới mà bạn không biết, hoặc những người bạn mà bạn nghi ngờ có hành vi rủi ro, đây có thể là dấu hiệu của vấn đề.</p>
          
          <div class="pl-11 mb-6">
            <p class="font-medium mb-2 text-gray-800">Các thay đổi khác có thể bao gồm:</p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Tránh các hoạt động gia đình hoặc tụ họp xã hội mà trước đây chúng thích</li>
              <li>Trở nên bí mật về hoạt động và nơi chúng đến</li>
              <li>Đột ngột quan tâm đến âm nhạc, thời trang hoặc văn hóa liên quan đến ma túy</li>
            </ul>
          </div>
        </div>
        
        <div class="mb-10">
          <h3 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</span>
            Suy giảm kết quả học tập
          </h3>
          
          <p class="text-lg leading-relaxed mb-4 pl-11">Sự suy giảm đáng kể về thành tích học tập có thể là dấu hiệu cảnh báo sớm về việc sử dụng chất gây nghiện. Các dấu hiệu bao gồm:</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="pl-11">
              <ul class="list-disc pl-6 space-y-2">
                <li>Thành tích học tập kém đi</li>
                <li>Thiếu động lực và tập trung</li>
                <li>Bỏ lớp hoặc trốn học</li>
                <li>Mất hứng thú với những hoạt động trước đây yêu thích</li>
              </ul>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070" alt="Academic decline" class="rounded-xl h-full object-cover shadow-md">
            </div>
          </div>
        </div>
        
        <div class="mb-10">
          <h3 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span class="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</span>
            Các thay đổi về thể chất
          </h3>
          
          <p class="text-lg leading-relaxed mb-4 pl-11">Việc sử dụng ma túy thường gây ra những thay đổi về thể chất có thể quan sát được:</p>
          
          <div class="pl-11 mb-6">
            <ul class="list-disc pl-6 space-y-2">
              <li>Mắt đỏ hoặc đục</li>
              <li>Đồng tử giãn nở hoặc co lại bất thường</li>
              <li>Thay đổi cân nặng đột ngột (tăng hoặc giảm)</li>
              <li>Thay đổi thói quen ăn uống hoặc ngủ nghỉ</li>
              <li>Chảy nước mũi hoặc ho không rõ nguyên nhân</li>
            </ul>
          </div>
        </div>
        
        <div class="my-10 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div class="flex flex-col md:flex-row items-center">
            <div class="md:w-1/2">
              <img src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=2070" alt="Family support" class="rounded-xl shadow-md">
            </div>
            <div class="md:w-1/2 md:pl-6 mt-4 md:mt-0">
              <h2 class="text-2xl font-bold text-gray-800 mb-4">Nếu bạn nhận thấy những dấu hiệu này thì sao?</h2>
              <p class="mb-4">Nếu bạn phát hiện ra bất kỳ dấu hiệu nào trong số này, điều quan trọng là không phản ứng thái quá. Thay vào đó:</p>
              
              <ul class="list-disc pl-6 space-y-2">
                <li><strong>Bắt đầu đối thoại:</strong> Nói chuyện với con bạn một cách bình tĩnh, không phán xét.</li>
                <li><strong>Lắng nghe:</strong> Cho con bạn cơ hội để chia sẻ những gì đang xảy ra.</li>
                <li><strong>Tham khảo ý kiến chuyên gia:</strong> Liên hệ với bác sĩ, nhà tư vấn học đường hoặc chuyên gia sức khỏe tâm thần để được hướng dẫn.</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Kết luận</h2>
        <p class="text-lg leading-relaxed mb-4">Nhận biết các dấu hiệu sử dụng ma túy ở thanh thiếu niên là bước đầu tiên trong việc giải quyết vấn đề tiềm ẩn. Can thiệp sớm rất quan trọng và có thể tạo ra sự khác biệt đáng kể trong việc ngăn chặn tình trạng lạm dụng chất gây nghiện nghiêm trọng hơn.</p>
      `,
      tags: ['Thanh thiếu niên', 'Ma túy', 'Phòng chống', 'Gia đình', 'Giáo dục']
    },
    {
      id: 2,
      title: 'Kỹ năng từ chối hiệu quả trong môi trường học đường',
      excerpt: 'Các kỹ năng giúp học sinh tự tin từ chối khi bị mời sử dụng chất cấm...',
      date: '22/04/2023',
      readTime: '5 phút đọc',
      author: 'ThS. Trần Thị B',
      category: 'Kỹ năng sống',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?q=80&w=2049',
      content: `
        <div class="mb-8">
          <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070" alt="Students in classroom" class="rounded-xl w-full h-auto shadow-md">
          <p class="text-sm text-gray-500 mt-2 text-center italic">Kỹ năng từ chối là công cụ quan trọng cho học sinh trong môi trường học đường</p>
        </div>
        
        <div class="text-center mb-8 p-6 bg-emerald-50 rounded-lg border border-emerald-100">
          <h2 class="text-2xl font-semibold text-emerald-800 mb-3">Tóm tắt nội dung</h2>
          <p class="text-emerald-700">Bài viết này giới thiệu các kỹ năng từ chối hiệu quả giúp học sinh đối phó với áp lực sử dụng chất cấm từ bạn bè.</p>
        </div>
        
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Từ chối hiệu quả - Kỹ năng sống quan trọng</h2>
        <p class="text-lg leading-relaxed mb-6">Học cách từ chối là một trong những kỹ năng sống quan trọng nhất mà thanh thiếu niên cần học. Đặc biệt trong môi trường học đường, áp lực đồng trang lứa có thể rất mạnh mẽ...</p>
        
        <div class="my-8">
          <img src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069" alt="Peer pressure" class="rounded-xl w-full h-auto shadow-md mb-6">
        </div>
        
        <h3 class="text-2xl font-bold text-gray-800 mb-4">Các chiến lược từ chối hiệu quả</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h4 class="font-bold text-xl mb-3 text-emerald-700">1. Nói "Không" một cách rõ ràng và tự tin</h4>
            <p>Sử dụng ngôn ngữ cơ thể tự tin, giữ eye contact và nói "không" một cách dứt khoát.</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h4 class="font-bold text-xl mb-3 text-emerald-700">2. Sử dụng ngôn ngữ cơ thể mạnh mẽ</h4>
            <p>Đứng thẳng, nhìn thẳng vào mắt người nói chuyện và thể hiện sự tự tin qua tư thế cơ thể.</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h4 class="font-bold text-xl mb-3 text-emerald-700">3. Đưa ra lý do hoặc cái cớ</h4>
            <p>Chuẩn bị sẵn một số lý do hoặc cái cớ đơn giản nhưng hiệu quả để từ chối.</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h4 class="font-bold text-xl mb-3 text-emerald-700">4. Rời khỏi tình huống</h4>
            <p>Nếu cảm thấy không thoải mái hoặc bị áp lực, hãy tìm cách rời khỏi tình huống đó.</p>
          </div>
        </div>
      `
    },
    {
      id: 3,
      title: 'Vai trò của gia đình trong phòng chống ma túy',
      excerpt: 'Gia đình là yếu tố quan trọng nhất trong việc phòng ngừa sử dụng ma túy...',
      date: '15/04/2023',
      readTime: '6 phút đọc',
      author: 'PGS.TS. Lê Văn C',
      category: 'Gia đình',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070',
      content: `
        <div class="mb-8">
          <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070" alt="Family dinner" class="rounded-xl w-full h-auto shadow-md">
          <p class="text-sm text-gray-500 mt-2 text-center italic">Gia đình đóng vai trò then chốt trong việc phòng chống ma túy ở thanh thiếu niên</p>
        </div>
        
        <h2 class="text-3xl font-bold text-gray-800 mb-4">Gia đình - Tuyến phòng thủ đầu tiên</h2>
        <p class="text-lg leading-relaxed mb-6">Gia đình đóng vai trò quan trọng trong việc ngăn ngừa lạm dụng chất gây nghiện. Môi trường gia đình ổn định, giao tiếp cởi mở và mối quan hệ tích cực giữa cha mẹ và con cái là những yếu tố bảo vệ mạnh mẽ...</p>
        
        <div class="my-8">
          <img src="https://images.unsplash.com/photo-1506836467174-27f1042aa48c?q=80&w=2070" alt="Family support" class="rounded-xl w-full h-auto shadow-md mb-6">
        </div>
        
        <h3 class="text-2xl font-bold text-gray-800 mb-4">Các chiến lược cho gia đình</h3>
        
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
          <ul class="space-y-4">
            <li class="flex items-start">
              <span class="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">1</span>
              <div>
                <h4 class="font-bold text-gray-800">Xây dựng giao tiếp mở và trung thực</h4>
                <p class="text-gray-600">Tạo môi trường nơi con có thể nói chuyện cởi mở về mọi vấn đề, kể cả những chủ đề nhạy cảm.</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">2</span>
              <div>
                <h4 class="font-bold text-gray-800">Thiết lập ranh giới và kỳ vọng rõ ràng</h4>
                <p class="text-gray-600">Đặt ra các quy tắc và hậu quả rõ ràng về hành vi không được chấp nhận.</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">3</span>
              <div>
                <h4 class="font-bold text-gray-800">Dành thời gian chất lượng cho con cái</h4>
                <p class="text-gray-600">Tham gia vào các hoạt động cùng nhau và chú ý đến cuộc sống hàng ngày của con.</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1">4</span>
              <div>
                <h4 class="font-bold text-gray-800">Làm gương tốt về hành vi lành mạnh</h4>
                <p class="text-gray-600">Con cái học hỏi thông qua quan sát. Thể hiện thái độ lành mạnh với rượu, thuốc lá và các chất gây nghiện khác.</p>
              </div>
            </li>
          </ul>
        </div>
      `
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      const foundBlog = blogPosts.find(post => post.id === parseInt(id));
      setBlog(foundBlog);
      
      if (foundBlog) {
        const related = blogPosts
          .filter(post => post.category === foundBlog.category && post.id !== foundBlog.id)
          .slice(0, 3);
        setRelatedPosts(related);
      }
      
      setLoading(false);
    }, 300);
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }
  
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài viết</h2>
          <p className="text-gray-600 mb-4">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link to="/blog" className="text-emerald-600 hover:underline">Quay lại trang Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header và hero section - TÁCH RIÊNG */}
      <div className="w-full bg-gradient-to-r from-emerald-900 to-emerald-700 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center text-emerald-100 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Quay lại Blog</span>
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-emerald-600 rounded-full text-xs font-medium">
              {blog.category}
            </span>
            <span className="text-emerald-100">•</span>
            <div className="flex items-center gap-1 text-sm text-emerald-100">
              <Calendar className="h-4 w-4" />
              <span>{blog.date}</span>
            </div>
            <span className="text-emerald-100">•</span>
            <div className="flex items-center gap-1 text-sm text-emerald-100">
              <Clock className="h-4 w-4" />
              <span>{blog.readTime || "5 phút đọc"}</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm opacity-75">Tác giả</p>
              <p className="font-medium">{blog.author}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Image - TÁCH KHỎI HEADER */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        {blog.image && (
          <div className="mb-8">
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-72 sm:h-96 object-cover" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/800x400?text=Blog+Image";
                }}
              />
            </div>
          </div>
        )}
        
        {/* Main content layout */}
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm p-6 mb-10">
          {/* Sidebar */}
          <div className="md:w-1/6 mb-8 md:mb-0 md:pr-6 md:border-r md:border-gray-100">
            <div className="sticky top-8">
              <h3 className="text-sm text-gray-500 uppercase mb-3 font-medium">Chia sẻ</h3>
              <div className="flex md:flex-col gap-2">
                <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Facebook className="h-5 w-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </button>
              </div>
              
              {blog.tags && (
                <div className="mt-8">
                  <h3 className="text-sm text-gray-500 uppercase mb-3 font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <Link 
                        key={index} 
                        to={`/blog?tag=${tag}`}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-emerald-50 hover:text-emerald-700 transition-colors block mb-2"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Article content */}
          <div className="md:w-5/6 md:pl-8">
            {/* Excerpt */}
            <div className="mb-8">
              <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-emerald-500 pl-4 italic">
                {blog.excerpt}
              </p>
            </div>
            
            {/* Article Content */}
            <article className="prose prose-emerald lg:prose-lg max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </article>
            
            {/* Author info */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-10">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tác giả</p>
                  <h3 className="font-bold text-xl">{blog.author}</h3>
                  <p className="text-gray-600">Chuyên gia về phòng chống ma túy và sức khỏe tâm thần thanh thiếu niên</p>
                </div>
              </div>
            </div>
            
            {/* Related Articles Section */}
            {relatedPosts.length > 0 && (
              <div className="border-t border-gray-200 pt-10 mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <BookOpen className="h-6 w-6 mr-2 text-emerald-600" />
                  Bài viết liên quan
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map(post => (
                    <Link key={post.id} to={`/blog/${post.id}`} className="group">
                      <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
                        <div className="aspect-video bg-gray-100">
                          {post.image && (
                            <img 
                              src={post.image} 
                              alt={post.title} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/300x200?text=Blog+Image";
                              }}
                            />
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>{post.category}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                          </div>
                          <h4 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-gray-600 line-clamp-2 mb-3">{post.excerpt}</p>
                          <span className="text-emerald-600 font-medium flex items-center group-hover:text-emerald-700">
                            Đọc thêm
                            <ChevronRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <Link 
                    to="/blog" 
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Xem tất cả bài viết
                  </Link>
                </div>
              </div>
            )}
            
            {/* Pagination */}
            <div className="flex justify-between items-center border-t border-gray-200 pt-8">
              <Link
                to={`/blog/${parseInt(id) - 1}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  parseInt(id) <= 1 
                    ? 'text-gray-400 pointer-events-none' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Bài trước</span>
              </Link>
              
              <Link
                to={`/blog/${parseInt(id) + 1}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  parseInt(id) >= blogPosts.length 
                    ? 'text-gray-400 pointer-events-none' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>Bài tiếp theo</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;