using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web;

namespace Program_3D.Function
{
    /// <summary>
    /// 网格化模型
    /// </summary>
    /// <returns></returns>
    public class MeshingModel : GetVandF
    {
        [DllImport("../bin/TG.dll", CallingConvention = CallingConvention.Winapi)]
        public extern static int ReVF(double[] pList, int[] fList, int pn, int fn, IntPtr outstruct);
        public MeshingModel(string StrVertices, string StrFaces) : base(StrVertices, StrFaces)
        {

        }

        public ResultVF TransformVF()
        {
            StringToArray();
            VFStruct vfout = new VFStruct();
            IntPtr ptr = Marshal.AllocHGlobal(Marshal.SizeOf(vfout));
            Marshal.StructureToPtr(vfout, ptr, false);
            int flag = ReVF(verticeArray, faceArray, verticesNum, facesNum, ptr);
            vfout = (VFStruct)Marshal.PtrToStructure(ptr, typeof(VFStruct));

            int[] flist = new int[vfout.FN * 3];
            int tmpnum1;
            for (int i = 0; i < vfout.FN * 3; i++)
            {
                IntPtr pt = new IntPtr(vfout.FList.ToInt64() + 4 * i);
                tmpnum1 = (int)Marshal.PtrToStructure(pt, typeof(int));
                flist[i] = tmpnum1;
            }

            double[] plist = new double[vfout.PN * 3];
            double tmpnum2;
            for (int i = 0; i < vfout.PN * 3; i++)
            {
                IntPtr pt = new IntPtr(vfout.PList.ToInt64() + 8 * i);
                tmpnum2 = (double)Marshal.PtrToStructure(pt, typeof(double));
                plist[i] = tmpnum2;
            }

            List<Face> resultF = new List<Face>();
            for (int i = 0; i < vfout.FN; i++)
            {
                Face face = new Face { a = flist[i * 3] - 1, b = flist[i * 3 + 1] - 1, c = flist[i * 3 + 2] - 1 };
                resultF.Add(face);
            }
            List<Vertice> resultV = new List<Vertice>();
            for (int i = 0; i < vfout.PN; i++)
            {
                Vertice vertice = new Vertice { x = plist[i * 3], y = plist[i * 3 + 1], z = plist[i * 3 + 2], };
                resultV.Add(vertice);
            }
            Marshal.FreeHGlobal(ptr);
            return new ResultVF { ResultV = resultV, ResultF = resultF };

        }
    }
}