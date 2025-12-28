/*
  # Seed Sample Data for Portfolio

  1. Sample Projects
  2. Sample Blog Posts
  3. Sample Work Experience
  4. Sample Education
  
  This provides initial data to showcase the portfolio functionality.
*/

-- Insert sample projects
INSERT INTO projects (
  title, slug, description, overview, features, role, contributions, tech_stack, 
  duration, cover_image, gallery_images, project_url, github_url, featured, category
) VALUES 
(
  'E-Commerce Platform',
  'ecommerce-platform',
  'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
  'Built a comprehensive e-commerce platform from scratch, handling everything from user authentication to payment processing. The platform supports multiple vendors, real-time inventory tracking, and advanced analytics for business insights.',
  ARRAY['Payment Integration', 'Inventory Management', 'Admin Dashboard', 'Multi-vendor Support', 'Real-time Analytics', 'Mobile Responsive'],
  'Full-Stack Developer & Project Lead',
  ARRAY['Architected the entire system architecture', 'Implemented secure payment processing with Stripe', 'Built responsive frontend with React and TypeScript', 'Developed RESTful APIs with Node.js and Express', 'Designed and optimized PostgreSQL database schema', 'Implemented real-time features with WebSockets'],
  ARRAY['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Stripe', 'Redis', 'Docker'],
  '6 months',
  'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'],
  'https://ecommerce-demo.example.com',
  'https://github.com/victoryjohnson/ecommerce-platform',
  true,
  'fullstack'
),
(
  'Task Management App',
  'task-management-app',
  'Collaborative project management tool with real-time updates, team collaboration, and analytics.',
  'Developed a modern task management application that helps teams organize, track, and complete projects efficiently. Features include real-time collaboration, advanced filtering, time tracking, and comprehensive reporting.',
  ARRAY['Real-time Collaboration', 'Advanced Filtering', 'Time Tracking', 'Team Management', 'Analytics Dashboard', 'Mobile App'],
  'Frontend Lead Developer',
  ARRAY['Led frontend development team of 3 developers', 'Implemented real-time features using WebSockets', 'Built responsive UI with Next.js and Tailwind CSS', 'Integrated with Supabase for backend services', 'Implemented advanced state management with Zustand', 'Optimized performance achieving 95+ Lighthouse score'],
  ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Zustand', 'Framer Motion'],
  '4 months',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'],
  'https://taskmanager-demo.example.com',
  'https://github.com/victoryjohnson/task-manager',
  true,
  'frontend'
),
(
  'API Gateway Service',
  'api-gateway-service',
  'Microservices API gateway with authentication, rate limiting, and monitoring capabilities.',
  'Built a robust API gateway service to handle microservices communication, authentication, and monitoring. The service processes over 1M requests daily with 99.9% uptime and comprehensive logging.',
  ARRAY['Authentication & Authorization', 'Rate Limiting', 'Request Routing', 'Monitoring & Logging', 'Load Balancing', 'Circuit Breaker Pattern'],
  'Backend Developer',
  ARRAY['Designed microservices architecture', 'Implemented JWT-based authentication', 'Built rate limiting and throttling mechanisms', 'Set up comprehensive monitoring with Prometheus', 'Implemented circuit breaker patterns for resilience', 'Optimized performance handling 1M+ daily requests'],
  ARRAY['Python', 'FastAPI', 'Docker', 'Redis', 'PostgreSQL', 'Prometheus', 'Grafana'],
  '3 months',
  'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800'],
  null,
  'https://github.com/victoryjohnson/api-gateway',
  false,
  'backend'
);

-- Insert sample blog posts
INSERT INTO blog_posts (
  title, slug, summary, content, tags, cover_image, published, featured, read_time
) VALUES 
(
  'Building Scalable React Applications with TypeScript',
  'building-scalable-react-typescript',
  'Learn best practices for structuring large React applications with TypeScript, including advanced patterns and performance optimizations.',
  '# Building Scalable React Applications with TypeScript

When building large-scale React applications, proper architecture and TypeScript integration become crucial for maintainability and developer experience. In this comprehensive guide, we''ll explore proven patterns and best practices.

## Project Structure

A well-organized project structure is the foundation of any scalable application:

```
src/
├── components/
│   ├── ui/
│   ├── forms/
│   └── layout/
├── hooks/
├── services/
├── types/
├── utils/
└── pages/
```

## TypeScript Best Practices

### 1. Strict Type Definitions

Always use strict TypeScript configurations and define comprehensive interfaces:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}
```

### 2. Generic Components

Create reusable components with proper generic typing:

```typescript
interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

function Table<T>({ data, columns, onRowClick }: TableProps<T>) {
  // Implementation
}
```

## Performance Optimization

### Code Splitting

Implement route-based code splitting for better performance:

```typescript
const LazyComponent = lazy(() => import("./components/HeavyComponent"));
```

### Memoization

Use React.memo and useMemo strategically:

```typescript
const ExpensiveComponent = memo(({ data }: Props) => {
  const processedData = useMemo(() => 
    heavyComputation(data), [data]
  );
  
  return <div>{processedData}</div>;
});
```

## State Management

For complex applications, consider using Zustand or Redux Toolkit with proper TypeScript integration.

## Conclusion

Building scalable React applications requires careful planning, proper TypeScript usage, and adherence to best practices. The patterns discussed here will help you create maintainable and performant applications.',
  ARRAY['React', 'TypeScript', 'Architecture', 'Performance'],
  'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  true,
  '12 min read'
),
(
  'Microservices Architecture: Lessons Learned',
  'microservices-lessons-learned',
  'Real-world insights from implementing microservices at scale, including common pitfalls and solutions.',
  '# Microservices Architecture: Lessons Learned

After implementing microservices architecture across multiple projects, I''ve learned valuable lessons about what works, what doesn''t, and how to avoid common pitfalls.

## The Good: Benefits We Actually Realized

### Independent Deployments
The ability to deploy services independently proved invaluable for our development velocity.

### Technology Diversity
Different services could use the most appropriate technology stack for their specific needs.

### Team Autonomy
Teams could work independently without stepping on each other''s toes.

## The Challenging: Unexpected Complexities

### Distributed System Complexity
Network calls, eventual consistency, and distributed debugging became significant challenges.

### Data Management
Managing transactions across services and maintaining data consistency required careful design.

### Monitoring and Observability
Tracking requests across multiple services demanded sophisticated monitoring solutions.

## Key Lessons

1. **Start with a Monolith**: Don''t begin with microservices unless you have a clear need.
2. **Domain-Driven Design**: Proper service boundaries are crucial for success.
3. **Invest in Tooling**: Monitoring, logging, and deployment automation are essential.
4. **Team Structure**: Conway''s Law is real - organize teams around service boundaries.

## Conclusion

Microservices can provide significant benefits, but they come with complexity costs. Make sure you''re solving the right problems before adopting this architecture.',
  ARRAY['Microservices', 'Architecture', 'Backend', 'DevOps'],
  'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  false,
  '8 min read'
),
(
  'The Future of Web Development: 2024 Trends',
  'web-development-trends-2024',
  'Exploring emerging technologies and trends that will shape the future of web development in 2024 and beyond.',
  '# The Future of Web Development: 2024 Trends

The web development landscape continues to evolve rapidly. Here are the key trends shaping our industry in 2024.

## 1. AI-Powered Development

AI tools are becoming integral to the development process:
- Code generation and completion
- Automated testing
- Bug detection and fixes
- Design to code conversion

## 2. Edge Computing

Moving computation closer to users:
- Reduced latency
- Better performance
- Improved user experience
- Cost optimization

## 3. WebAssembly Growth

WASM is enabling new possibilities:
- High-performance web applications
- Language diversity on the web
- Desktop-class applications in browsers

## 4. Jamstack Evolution

Static site generation continues to mature:
- Better dynamic capabilities
- Improved developer experience
- Enhanced performance
- Simplified deployment

## 5. Sustainability Focus

Green web development practices:
- Performance optimization
- Reduced carbon footprint
- Efficient resource usage
- Sustainable hosting solutions

## Conclusion

The future of web development is exciting, with AI, edge computing, and sustainability leading the charge. Staying current with these trends will be crucial for developers.',
  ARRAY['Web Development', 'Trends', 'Future', 'AI'],
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  true,
  '6 min read'
);

-- Insert sample work experience
INSERT INTO work_experience (
  company, position, duration, location, description, responsibilities, technologies, 
  logo, company_url, order_index
) VALUES 
(
  'TechCorp Solutions',
  'Senior Full-Stack Developer',
  '2022 - Present',
  'San Francisco, CA',
  'Leading development of scalable web applications serving 100K+ users. Architected microservices infrastructure and mentored junior developers.',
  ARRAY[
    'Architected and developed microservices using Node.js and Python',
    'Led a team of 5 developers in agile development practices',
    'Implemented CI/CD pipelines reducing deployment time by 60%',
    'Optimized database queries improving application performance by 40%',
    'Mentored junior developers and conducted code reviews',
    'Collaborated with product managers to define technical requirements'
  ],
  ARRAY['React', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'TypeScript', 'GraphQL'],
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://techcorp.example.com',
  1
),
(
  'StartupXYZ',
  'Full-Stack Developer',
  '2021 - 2022',
  'Remote',
  'Built the core platform from scratch, handling both frontend and backend development. Worked directly with founders to define product requirements.',
  ARRAY[
    'Developed MVP from concept to launch in 6 months',
    'Built responsive web application using React and Next.js',
    'Designed and implemented RESTful APIs with Express.js',
    'Integrated third-party services including Stripe and SendGrid',
    'Implemented user authentication and authorization systems',
    'Set up monitoring and analytics tracking'
  ],
  ARRAY['Next.js', 'Express.js', 'MongoDB', 'Stripe', 'Vercel', 'TypeScript'],
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://startupxyz.example.com',
  2
),
(
  'Digital Agency Pro',
  'Frontend Developer',
  '2020 - 2021',
  'New York, NY',
  'Specialized in creating high-performance, responsive websites for enterprise clients. Collaborated with design teams to implement pixel-perfect interfaces.',
  ARRAY[
    'Developed 20+ responsive websites using modern frameworks',
    'Collaborated with UX/UI designers to implement design systems',
    'Optimized websites for performance achieving 95+ Lighthouse scores',
    'Maintained and updated legacy codebases',
    'Implemented accessibility standards (WCAG 2.1)',
    'Conducted client presentations and technical consultations'
  ],
  ARRAY['React', 'Vue.js', 'Sass', 'Webpack', 'Figma', 'WordPress'],
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=100',
  'https://digitalagencypro.example.com',
  3
);

-- Insert sample education
INSERT INTO education (
  degree, university, year, gpa, description, order_index
) VALUES 
(
  'Bachelor of Science in Computer Science',
  'University of California, Berkeley',
  '2016 - 2020',
  '3.8/4.0',
  'Focused on software engineering, algorithms, and data structures. Completed senior capstone project on distributed systems. Active member of the Computer Science Student Association.',
  1
),
(
  'Full-Stack Web Development Bootcamp',
  'General Assembly',
  '2019',
  null,
  'Intensive 12-week program covering modern web development technologies including React, Node.js, and database design. Built 3 full-stack applications as part of the curriculum.',
  2
);